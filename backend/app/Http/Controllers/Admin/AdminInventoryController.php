<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AdminInventoryController extends Controller
{
    public function getProductDetailBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search'       => 'nullable|string|max:255',
                'category'     => 'nullable|string',
                'is_available' => 'nullable|in:true,false',
                'stock_min'    => 'nullable|integer|min:0',
                'stock_max'    => 'nullable|integer|min:0',
                'page'         => 'nullable|integer|min:1',
            ]);

            $validator->after(function ($validator) use ($request) {
                if (
                    $request->filled('stock_min') &&
                    $request->filled('stock_max') &&
                    (int)$request->stock_min > (int)$request->stock_max
                ) {
                    $validator->errors()->add('stock_min', 'stock_min cannot be greater than stock_max.');
                }
            });

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $filters = "";
            $params = [];
            $requiresCategoryJoin = false;

            if ($request->filled('search')) {
                $filters .= " AND (p.product_id LIKE ? OR p.name LIKE ?)";
                $term = '%' . $request->search . '%';
                $params[] = $term;
                $params[] = $term;
            }

            if ($request->filled('category')) {
                $categories = array_map('trim', explode(',', $request->category));
                if (count($categories)) {
                    $placeholders = implode(',', array_fill(0, count($categories), '?'));
                    $filters .= " AND c.category_name IN ($placeholders)";
                    foreach ($categories as $cat) {
                        $params[] = $cat;
                    }
                    $requiresCategoryJoin = true;
                }
            }

            if ($request->filled('stock_min') && $request->filled('stock_max')) {
                if ((int)$request->stock_min > (int)$request->stock_max) {
                    return response()->json([
                        'success' => false,
                        'message' => 'stock_min cannot be greater than stock_max.'
                    ], 422);
                }
            }

            if ($request->filled('is_available')) {
                $filters .= " AND p.is_available = ?";
                $params[] = $request->is_available === 'true' ? 1 : 0;
            }

            if ($request->filled('stock_min')) {
                $filters .= " AND p.stock_quantity >= ?";
                $params[] = (int)$request->stock_min;
            }
            if ($request->filled('stock_max')) {
                $filters .= " AND p.stock_quantity <= ?";
                $params[] = (int)$request->stock_max;
            }

            // Count total
            $countSql = "
                SELECT COUNT(*) AS total
                FROM products p
                " . ($requiresCategoryJoin ? "LEFT JOIN categories c ON p.category_id = c.category_id" : "") . "
                WHERE 1=1 $filters
                AND p.deleted_at IS NULL
            ";

            $totalResult = DB::select($countSql, $params);
            if (!$totalResult || !isset($totalResult[0]->total)) {
                throw new \Exception("Failed to count records.");
            }
            $total = $totalResult[0]->total ?? 0;

            $page = max(1, (int)$request->input('page', 1));
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $params[] = $perPage;
            $params[] = $offset;

            // Main query
            $dataSql = "
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    p.is_available,
                    p.stock_quantity,
                    c.category_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE 1=1 $filters
                AND p.deleted_at IS NULL
                ORDER BY p.updated_at DESC
                LIMIT ? OFFSET ?
            ";

            $products = DB::select($dataSql, $params);

            return response()->json([
                'success' => true,
                'data' => $products,
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
                'error' => $e->getMessage()
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
                    p.description,
                    p.stock_quantity,
                    p.is_available,
                    m.manufacturer_name,
                    c.category_name,
                    GROUP_CONCAT(pi.image_path) AS image_paths
                FROM products p
                LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN product_images pi ON pi.product_id = p.product_id
                WHERE p.product_id = ?
                AND p.deleted_at IS NULL
                GROUP BY 
                    p.product_id,
                    p.name,
                    p.price,
                    p.description,
                    p.stock_quantity,
                    p.is_available,
                    m.manufacturer_name,
                    c.category_name
                LIMIT 1
            ", [$product_id]);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }

            $imageArray = $product->image_paths
                ? explode(',', $product->image_paths)
                : [];

            return response()->json([
                'success' => true,
                'data' => [
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'stock_quantity' => $product->stock_quantity,
                    'is_available' => (bool)$product->is_available,
                    'manufacturer' => $product->manufacturer_name,
                    'category' => $product->category_name,
                    'images' => $imageArray
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createProduct(Request $request)
    {
        DB::statement("START TRANSACTION");

        try {
            // Get admin info from token
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");
            $admin_id = $admin['admin_id'];

            // Validate request
            $validator = Validator::make($request->all(), [
                'product_id'        => 'required|string|size:8|unique:products,product_id',
                'name'              => 'required|string|max:255',
                'price'             => 'required|numeric|min:0.01',
                'description'       => 'nullable|string',
                'stock_quantity'    => 'required|integer|min:0',
                'is_available'      => 'required|boolean',
                'manufacturer_name' => 'sometimes|string|max:255',
                'category_name'     => 'sometimes|string|max:255',
                'images'            => 'sometimes|array|min:1',
                'images.*'          => 'string|max:2048',
            ]);

            $errors = $validator->errors();

            // Custom logic: check manufacturer
            $manufacturer = DB::selectOne("SELECT manufacturer_id FROM manufacturers WHERE manufacturer_name = ?", [$request->manufacturer_name]);
            if (!$manufacturer) {
                $errors->add('manufacturer_name', "Manufacturer '{$request->manufacturer_name}' not found.");
            }

            // Custom logic: check category
            $category = DB::selectOne("SELECT category_id FROM categories WHERE category_name = ?", [$request->category_name]);
            if (!$category) {
                $errors->add('category_name', "Category '{$request->category_name}' not found.");
            }

            if ($errors->any()) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $errors
                ], 422);
            }

            // Insert into products
            DB::insert("
                INSERT INTO products (
                    product_id, name, price, description, is_available, stock_quantity,
                    manufacturer_id, category_id, created_by, updated_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $request->product_id,
                $request->name,
                $request->price,
                $request->description,
                $request->is_available,
                $request->stock_quantity,
                $manufacturer->manufacturer_id,
                $category->category_id,
                $admin_id,
                $admin_id
            ]);

            // Insert product images
            if ($request->filled('images') && is_array($request->images)) {
                foreach ($request->images as $imagePath) {
                    DB::insert("INSERT INTO product_images (product_id, image_path) VALUES (?, ?)", [
                        $request->product_id,
                        $imagePath
                    ]);
                }
            }

            DB::statement("COMMIT");

            return response()->json([
                'success' => true,
                'message' => "Product {$request->product_id} created successfully."
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }

    public function updateProductDetailByID(Request $request, $product_id)
    {
        DB::statement("START TRANSACTION");

        try {
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");
            $admin_id = $admin['admin_id'];

            $validator = Validator::make($request->all(), [
                'name'              => 'sometimes|string|max:255',
                'description'       => 'sometimes|nullable|string',
                'price'             => 'sometimes|numeric|min:0.01',
                'stock_quantity'    => 'sometimes|integer|min:0',
                'is_available'      => 'sometimes|boolean',
                'manufacturer_name' => 'sometimes|string|max:255',
                'category_name'     => 'sometimes|string|max:255',
                'images'            => 'sometimes|array|min:1',
                'images.*'          => 'string|max:2048',
            ]);

            $errors = $validator->errors();

            // Manufacturer check
            $manufacturer_id = null;
            if ($request->filled('manufacturer_name')) {
                $manu = DB::selectOne("SELECT manufacturer_id FROM manufacturers WHERE manufacturer_name = ?", [$request->manufacturer_name]);
                if (!$manu) {
                    $errors->add('manufacturer_name', "Manufacturer '{$request->manufacturer_name}' not found.");
                } else {
                    $manufacturer_id = $manu->manufacturer_id;
                }
            }

            // Category check
            $category_id = null;
            if ($request->filled('category_name')) {
                $cat = DB::selectOne("SELECT category_id FROM categories WHERE category_name = ?", [$request->category_name]);
                if (!$cat) {
                    $errors->add('category_name', "Category '{$request->category_name}' not found.");
                } else {
                    $category_id = $cat->category_id;
                }
            }

            if ($errors->any()) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $errors
                ], 422);
            }

            // Ensure product exists
            $exists = DB::selectOne("SELECT product_id FROM products WHERE product_id = ? AND deleted_at IS NULL", [$product_id]);
            if (!$exists) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }

            // Build dynamic update query
            $fields = [];
            $values = [];
    
            foreach (['name', 'description', 'price', 'stock_quantity', 'is_available'] as $field) {
                if ($request->filled($field) || $request->has($field)) {
                    $fields[] = "$field = ?";
                    $values[] = $request->$field;
                }
            }
    
            if ($manufacturer_id !== null) {
                $fields[] = "manufacturer_id = ?";
                $values[] = $manufacturer_id;
            }
    
            if ($category_id !== null) {
                $fields[] = "category_id = ?";
                $values[] = $category_id;
            }
    
            if (!empty($fields)) {
                $fields[] = "updated_at = CURRENT_TIMESTAMP";
                $fields[] = "updated_by = ?";
                $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE product_id = ?";
                $values[] = $admin_id;
                $values[] = $product_id;
    
                DB::update($sql, $values);
            }
    
            // Update images if provided
            if ($request->filled('images') && is_array($request->images)) {
                DB::delete("DELETE FROM product_images WHERE product_id = ?", [$product_id]);
    
                foreach ($request->images as $imagePath) {
                    DB::insert("INSERT INTO product_images (product_id, image_path) VALUES (?, ?)", [
                        $product_id,
                        $imagePath
                    ]);
                }
            }
    
            DB::statement("COMMIT");
    
            return response()->json([
                'success' => true,
                'message' => "Product {$product_id} updated successfully."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteProductByID($product_id)
    {
        try {
            $product = DB::selectOne("SELECT product_id FROM products WHERE product_id = ? AND deleted_at IS NULL", [$product_id]);
    
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found or already deleted.'
                ], 404);
            }
    
            DB::update("UPDATE products SET deleted_at = NOW() WHERE product_id = ?", [$product_id]);
    
            return response()->json([
                'success' => true,
                'message' => "Product {$product_id} soft-deleted successfully."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }    
}
