<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AdminReviewsContrlloer extends Controller
{
    public function getProductCardBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search'       => 'nullable|string|max:255',
                'category'     => 'nullable|string',
                'price_min'    => 'nullable|numeric|min:0',
                'price_max'    => 'nullable|numeric|min:0',
                'page'         => 'nullable|integer|min:1',
            ]);

            // Fix: compare price_min and price_max
            $validator->after(function ($validator) use ($request) {
                if (
                    $request->filled('price_min') &&
                    $request->filled('price_max') &&
                    (float)$request->price_min > (float)$request->price_max
                ) {
                    $validator->errors()->add('price_min', 'price_min cannot be greater than price_max.');
                }
            });

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Fail.',
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

            if ($request->filled('price_min')) {
                $filters .= " AND p.price >= ?";
                $params[] = (float)$request->price_min;
            }

            if ($request->filled('price_max')) {
                $filters .= " AND p.price <= ?";
                $params[] = (float)$request->price_max;
            }

            // Count query
            $countSql = "
                SELECT COUNT(DISTINCT p.product_id) AS total
                FROM products p
                " . ($requiresCategoryJoin ? "LEFT JOIN categories c ON p.category_id = c.category_id" : "") . "
                WHERE 1=1 $filters
            ";

            $totalResult = DB::select($countSql, $params);
            if (!$totalResult || !isset($totalResult[0]->total)) {
                throw new \Exception("Failed to count records.");
            }

            $total = $totalResult[0]->total ?? 0;
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 10;
            $offset = ($page - 1) * $perPage;

            $params[] = $perPage;
            $params[] = $offset;

            // Main data query
            $dataSql = "
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    (
                        SELECT pi.image_path
                        FROM product_images pi
                        WHERE pi.product_id = p.product_id
                        LIMIT 1
                    ) AS thumbnail,
                    ROUND(IFNULL(AVG(r.rating), 0), 1) AS average_rating
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN reviews r ON r.product_id = p.product_id
                WHERE 1=1 $filters
                GROUP BY p.product_id, p.name, p.price
                ORDER BY p.updated_at DESC
                LIMIT ? OFFSET ?;
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

    public function getProductReviewByID(Request $request, $product_id)
    {
        try {
            // Validate page input
            $validator = Validator::make($request->all(), [
                'page' => 'nullable|integer|min:1',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Fail.',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            // 🔍 Optimized query for product + review summary
            $summary = DB::selectOne("
                SELECT
                    p.product_id,
                    p.name AS product_name,
                    (
                        SELECT pi.image_path 
                        FROM product_images pi 
                        WHERE pi.product_id = p.product_id 
                        LIMIT 1
                    ) AS thumbnail,
                    COUNT(r.review_id) AS total_reviews,
                    ROUND(AVG(r.rating), 1) AS average_rating,
                    COUNT(CASE WHEN r.rating = 1 THEN 1 END) AS rating_1,
                    COUNT(CASE WHEN r.rating = 2 THEN 1 END) AS rating_2,
                    COUNT(CASE WHEN r.rating = 3 THEN 1 END) AS rating_3,
                    COUNT(CASE WHEN r.rating = 4 THEN 1 END) AS rating_4,
                    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS rating_5
                FROM products p
                LEFT JOIN reviews r ON p.product_id = r.product_id
                WHERE p.product_id = ?
                GROUP BY p.product_id
            ", [$product_id]);
    
            if (!$summary) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product are not found.'
                ], 404);
            }
    
            // Pagination setup
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 3;
            $offset = ($page - 1) * $perPage;
    
            // 📝 Fetch paginated review list
            $reviews = DB::select("
                SELECT 
                    r.review_id,
                    r.rating,
                    r.comment,
                    r.reply_comment,
                    r.created_at,
                    r.customer_id
                FROM reviews r
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
                LIMIT ? OFFSET ?
            ", [$product_id, $perPage, $offset]);
    
            return response()->json([
                'success' => true,
                'summary' => [
                    'product_id' => $summary->product_id,
                    'product_name' => $summary->product_name,
                    'thumbnail' => $summary->thumbnail,
                    'average_rating' => (float)($summary->average_rating ?? 0),
                    'total_reviews' => (int)($summary->total_reviews ?? 0),
                    'breakdown' => [
                        1 => (int)($summary->rating_1 ?? 0),
                        2 => (int)($summary->rating_2 ?? 0),
                        3 => (int)($summary->rating_3 ?? 0),
                        4 => (int)($summary->rating_4 ?? 0),
                        5 => (int)($summary->rating_5 ?? 0)
                    ]
                ],
                'data' => $reviews,
                'pagination' => [
                    'total' => (int)$summary->total_reviews,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($summary->total_reviews / $perPage)
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
    

    public function replyComment(Request $request, $review_id)
    {
        try {
            // Auth admin from token
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");
            $admin_id = $admin['admin_id'];

            // Validate reply_comment
            $validator = Validator::make($request->all(), [
                'reply_comment' => 'required|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if review exists
            $review = DB::selectOne("SELECT review_id FROM reviews WHERE review_id = ?", [$review_id]);
            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Review not found.'
                ], 404);
            }

            // Update review with reply
            DB::update("
            UPDATE reviews
            SET reply_comment = ?, replied_by = ?
            WHERE review_id = ?
        ", [
                $request->reply_comment,
                $admin_id,
                $review_id
            ]);

            return response()->json([
                'success' => true,
                'message' => "Reply added to review {$review_id}."
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
