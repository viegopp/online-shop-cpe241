<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AdminFlashSaleController extends Controller
{
    public function getFlashSaleBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:255',
                'status' => 'nullable|in:true,false',
                'page'   => 'nullable|integer|min:1',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error.',
                    'errors'  => $validator->errors()
                ], 422);
            }
    
            $filters = "";
            $params = [];
    
            // Search by promotion ID or name
            if ($request->filled('search')) {
                if (is_numeric($request->search)) {
                    $filters .= " AND pr.promotion_id = ?";
                    $params[] = $request->search;
                } else {
                    $filters .= " AND pr.name LIKE ?";
                    $params[] = '%' . $request->search . '%';
                }
            }
    
            // Filter by is_available (status)
            if ($request->filled('status')) {
                $filters .= " AND pr.is_available = ?";
                $params[] = $request->status === 'true' ? 1 : 0;
            }
    
            // Pagination setup
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 3;
            $offset = ($page - 1) * $perPage;
    
            // Total count
            $countSql = "
                SELECT COUNT(*) AS total
                FROM promotions pr
                WHERE 1=1 $filters
            ";
            $total = DB::selectOne($countSql, $params)->total ?? 0;
    
            $params[] = $perPage;
            $params[] = $offset;
    
            // Data query with first 3 product images
            $dataSql = "SELECT 
                    pr.promotion_id,
                    pr.name,
                    pr.is_available AS status,
                    DATE_FORMAT(pr.release_date, '%b %d, %Y') AS start,
                    DATE_FORMAT(pr.expiry_date, '%b %d, %Y') AS end
                FROM promotions pr
                WHERE 1=1 $filters
                ORDER BY pr.updated_at DESC
                LIMIT ? OFFSET ?
            ";
    
            $results = DB::select($dataSql, $params);
    
            return response()->json([
                'success' => true,
                'data' => $results,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function getFlashSaleByID($promotion_id)
    {
        try {
            // SECTION 1: Promotion metadata
            $promotion = DB::selectOne("
                SELECT 
                    pr.promotion_id,
                    pr.name,
                    pr.discount_percent,
                    DATE_FORMAT(pr.release_date, '%b %d, %Y %H:%i:%s') AS start_date,
                    DATE_FORMAT(pr.expiry_date, '%b %d, %Y %H:%i:%s') AS end_date,
                    pr.is_available AS status,
                    pr.banner_path
                FROM promotions pr
                WHERE pr.promotion_id = ?
            ", [$promotion_id]);
    
            if (!$promotion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promotion not found.'
                ], 404);
            }
    
            // SECTION 2: All products in this promotion
            $products = DB::select("
                SELECT 
                    p.product_id,
                    (
                        SELECT pi.image_path 
                        FROM product_images pi 
                        WHERE pi.product_id = p.product_id 
                        ORDER BY pi.image_id ASC 
                        LIMIT 1
                    ) AS image_path,
                    p.name AS product_name,
                    p.price AS original_price,
                    ROUND(p.price * (1 - pr.discount_percent / 100), 2) AS promotion_price
                FROM promotion_products pp
                JOIN products p ON pp.product_id = p.product_id
                JOIN promotions pr ON pp.promotion_id = pr.promotion_id
                WHERE pp.promotion_id = ?
            ", [$promotion_id]);
    
            return response()->json([
                'success' => true,
                'promotion' => $promotion,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }    

    public function createFlashSale(Request $request)
    {
        DB::statement("START TRANSACTION");
    
        try {
            $validator = Validator::make($request->all(), [
                'promotion_id'      => 'required|string|size:8',
                'promotion_name'    => 'required|string|max:50',
                'discount_percent'  => 'required|integer|between:0,100',
                'release_date'      => 'required|date|before:expiry_date',
                'expiry_date'       => 'required|date|after:release_date',
                'is_available'      => 'nullable|boolean',
                'banner_path'       => 'nullable|string|max:2048',
                'product_ids'       => 'nullable|array',
                'product_ids.*'     => 'required|string|size:8',
            ]);
            
            $errors = $validator->errors();
            
            // Manual unique check
            $existingPromotion = DB::selectOne("SELECT 1 FROM promotions WHERE promotion_id = ?", [$request->promotion_id]);
            if ($existingPromotion) {
                $errors->add('promotion_id', 'The promotion_id has already been taken.');
            }
            
            // Manual product check (exists and not soft-deleted)
            $invalidProductIds = [];
            if (!empty($request->product_ids)) {
                foreach ($request->product_ids as $id) {
                    $product = DB::selectOne("SELECT 1 FROM products WHERE product_id = ? AND deleted_at IS NULL", [$id]);
                    if (!$product) {
                        $invalidProductIds[] = $id;
                    }
                }
            
                if (!empty($invalidProductIds)) {
                    $errors->add('product_ids', 'These product_ids are invalid or soft-deleted: ' . implode(', ', $invalidProductIds));
                }
            }
            
            // Return all combined errors
            if ($errors->any()) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $errors
                ], 422);
            }
    
            // Get admin from cache token
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");
            $admin_id = $admin['admin_id'];
    
            // Insert promotion
            DB::insert("
                INSERT INTO promotions (
                    promotion_id, name, release_date, expiry_date,
                    is_available, banner_path, discount_percent,
                    created_by, updated_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $request->promotion_id,
                $request->promotion_name,
                $request->release_date,
                $request->expiry_date,
                $request->is_available ?? false,
                $request->banner_path,
                $request->discount_percent,
                $admin_id,
                $admin_id
            ]);
    
            // Insert product-promotion links
            foreach ($request->product_ids as $product_id) {
                DB::insert("
                    INSERT INTO promotion_products (promotion_id, product_id)
                    VALUES (?, ?)
                ", [
                    $request->promotion_id,
                    $product_id
                ]);
            }
    
            DB::statement("COMMIT");
    
            return response()->json([
                'success' => true,
                'message' => "Flash sale '{$request->promotion_id}' created successfully with " . count($request->product_ids) . " products."
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }     

    public function updateFlashSaleByID(Request $request, $promotion_id)
    {
        DB::statement("START TRANSACTION");
    
        try {
            $validator = Validator::make($request->all(), [
                'promotion_name'    => 'nullable|string|max:50',
                'discount_percent'  => 'nullable|integer|between:0,100',
                'release_date'      => 'nullable|date',
                'expiry_date'       => 'nullable|date',
                'is_available'      => 'nullable|boolean',
                'banner_path'       => 'nullable|string|max:2048',
                'product_ids'       => 'nullable|array|min:1',
                'product_ids.*'     => 'required|string|size:8',
            ]);
    
            $errors = $validator->errors();
    
            // Manual product_ids validation: must exist and not soft-deleted
            $invalidProductIds = [];
            if (!empty($request->product_ids)) {
                foreach ($request->product_ids as $id) {
                    $product = DB::selectOne("SELECT 1 FROM products WHERE product_id = ? AND deleted_at IS NULL", [$id]);
                    if (!$product) {
                        $invalidProductIds[] = $id;
                    }
                }
                if (!empty($invalidProductIds)) {
                    $errors->add('product_ids', 'These product_ids are invalid or soft-deleted: ' . implode(', ', $invalidProductIds));
                }
            }
    
            // If any error from either validator or manual checks
            if ($errors->any()) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $errors
                ], 422);
            }
    
            // Check if promotion exists
            $existing = DB::selectOne("SELECT promotion_id FROM promotions WHERE promotion_id = ?", [$promotion_id]);
            if (!$existing) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => "Promotion $promotion_id not found."
                ], 404);
            }
    
            // Admin from token
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");
            $admin_id = $admin['admin_id'];
    
            // Update fields
            $fields = [];
            $values = [];
    
            foreach ([
                'promotion_name' => 'name',
                'discount_percent',
                'release_date',
                'expiry_date',
                'is_available',
                'banner_path'
            ] as $input => $column) {
                $column = is_string($column) ? $column : $input;
                if ($request->filled($input) || $request->has($input)) {
                    $fields[] = "$column = ?";
                    $values[] = $request->$input;
                }
            }
    
            if (!empty($fields)) {
                $fields[] = "updated_by = ?";
                $fields[] = "updated_at = CURRENT_TIMESTAMP";
                $values[] = $admin_id;
    
                $sql = "UPDATE promotions SET " . implode(', ', $fields) . " WHERE promotion_id = ?";
                $values[] = $promotion_id;
    
                DB::update($sql, $values);
            }
    
            // Sync product_ids
            if ($request->filled('product_ids')) {
                DB::delete("DELETE FROM promotion_products WHERE promotion_id = ?", [$promotion_id]);
    
                foreach ($request->product_ids as $product_id) {
                    DB::insert("INSERT INTO promotion_products (promotion_id, product_id) VALUES (?, ?)", [
                        $promotion_id,
                        $product_id
                    ]);
                }
            }
    
            DB::statement("COMMIT");
    
            return response()->json([
                'success' => true,
                'message' => "Promotion $promotion_id updated successfully."
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
    
    public function deleteFlashSaleByID($promotion_id)
    {
        DB::statement("START TRANSACTION");
    
        try {
            // Check existence
            $promotion = DB::selectOne("SELECT promotion_id FROM promotions WHERE promotion_id = ?", [$promotion_id]);
            if (!$promotion) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => "Promotion '$promotion_id' not found."
                ], 404);
            }
    
            // Delete related promotion_products
            DB::delete("DELETE FROM promotion_products WHERE promotion_id = ?", [$promotion_id]);
    
            // Delete the promotion itself
            DB::delete("DELETE FROM promotions WHERE promotion_id = ?", [$promotion_id]);
    
            DB::statement("COMMIT");
    
            return response()->json([
                'success' => true,
                'message' => "Promotion '$promotion_id' has been deleted permanently."
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");
    
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }    

    public function getProductDetailByID($product_id)
    {
        try {
            $product = DB::selectOne("
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    (
                        SELECT pi.image_path
                        FROM product_images pi
                        WHERE pi.product_id = p.product_id
                        ORDER BY pi.image_id ASC
                        LIMIT 1
                    ) AS image
                FROM products as p
                WHERE p.product_id = ?
                  AND p.deleted_at IS NULL
                LIMIT 1
            ", [$product_id]);
    
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'data' => [
                    'product_id'      => $product->product_id,
                    'name'            => $product->name,
                    'image'           => $product->image,
                    'price'           => (float)$product->price,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }    
}