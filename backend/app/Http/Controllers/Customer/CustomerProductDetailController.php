<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CustomerProductDetailController extends Controller
{
    public function getProductDetailByID(Request $request, $product_id)
    {
        try {
            // 1. Check valid product
            $product = DB::selectOne("
                SELECT 
                    p.product_id,
                    p.name,
                    p.description,
                    p.price AS original_price,
                    ROUND(p.price * (1 - COALESCE(MAX(prm.discount_percent), 0) / 100), 2) AS final_price,
                    p.stock_quantity,
                    p.is_available,
                    GROUP_CONCAT(DISTINCT pi.image_path) AS image_gallery
                FROM products p
                LEFT JOIN product_images pi ON p.product_id = pi.product_id
                LEFT JOIN promotion_products pp ON p.product_id = pp.product_id
                LEFT JOIN promotions prm ON pp.promotion_id = prm.promotion_id 
                    AND prm.is_available = 1
                    AND NOW() BETWEEN prm.release_date AND prm.expiry_date
                WHERE 
                    p.product_id = ?
                    AND p.is_available = TRUE
                    AND p.deleted_at IS NULL
                GROUP BY 
                    p.product_id, p.name, p.description, p.price, p.stock_quantity, p.is_available
            ", [$product_id]);
    
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found or not available.'
                ], 404);
            }
    
            // 2. Rating summary
            $ratingSummary = DB::selectOne("
                SELECT 
                    ROUND(AVG(r.rating), 1) AS avg_rating,
                    COUNT(*) AS total_reviews
                FROM reviews r
                WHERE r.product_id = ?
            ", [$product_id]);
    
            // 3. Rating breakdown
            $ratingBreakdown = DB::select("
                SELECT 
                    r.rating,
                    COUNT(*) AS review_count
                FROM reviews r
                WHERE r.product_id = ?
                GROUP BY r.rating
                ORDER BY r.rating DESC
            ", [$product_id]);
    
            // 4. Review pagination setup
            $reviewPage = max((int) $request->input('page', 1), 1);
            $reviewLimit = 3;
            $reviewOffset = ($reviewPage - 1) * $reviewLimit;
    
            // 5. Paginated recent reviews
            $reviews = DB::select("
                SELECT 
                    r.rating,
                    r.comment,
                    r.reply_comment,
                    r.created_at,
                    c.customer_id,
                    u.first_name,
                    u.last_name,
                    a.admin_id
                FROM reviews r
                JOIN customers c ON r.customer_id = c.customer_id
                JOIN users u ON c.user_id = u.user_id
                LEFT JOIN admins a ON r.replied_by = a.admin_id
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
                LIMIT ? OFFSET ?
            ", [$product_id, $reviewLimit, $reviewOffset]);
    
            return response()->json([
                'success' => true,
                'data' => [
                    'product' => [
                        'product_id'     => $product->product_id,
                        'name'           => $product->name,
                        'description'    => $product->description,
                        'original_price' => (float)$product->original_price,
                        'final_price'    => (float)$product->final_price,
                        'stock_quantity' => $product->stock_quantity,
                        'is_available'   => (bool)$product->is_available,
                        'images'         => $product->image_gallery ? explode(',', $product->image_gallery) : []
                    ],
                    'rating_summary'    => $ratingSummary ?? ['avg_rating' => null, 'total_reviews' => 0],
                    'rating_breakdown'  => $ratingBreakdown,
                    'recent_reviews'    => $reviews,
                    'review_pagination' => [
                        'current_page' => $reviewPage,
                        'per_page'     => $reviewLimit,
                        'offset'       => $reviewOffset,
                        'total_reviews'=> $ratingSummary->total_reviews ?? 0
                    ]
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

    public function addToCart(Request $request)
    {
        $token = $request->bearerToken();
        $customer = Cache::get("customer_token:$token");
        $customer_id = $customer['customer_id'];

        $validator = Validator::make($request->all(), [
            'product_id'  => 'required|string|exists:products,product_id',
            'quantity'    => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::statement("START TRANSACTION");

        try {
            $quantity = $request->input('quantity', 1);

            DB::statement("
                INSERT INTO cart_items (customer_id, product_id, quantity, added_at)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = NOW()
            ", [
                $customer_id,
                $request->product_id,
                $quantity
            ]);

            DB::statement("COMMIT");

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart.'
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");

            return response()->json([
                'success' => false,
                'message' => 'Failed to add product.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
