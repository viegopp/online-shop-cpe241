<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerProductDetailController extends Controller
{
    public function getProductDetailByID(Request $request, $product_id)
    {
        try {
            // Product detail with image gallery and promotion
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
                    AND NOW() BETWEEN prm.release_date AND prm.expiry_date
                WHERE p.product_id = ?
                GROUP BY 
                    p.product_id, p.name, p.description, p.price, p.stock_quantity, p.is_available
            ", [$product_id]);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.'
                ], 404);
            }

            // Rating summary
            $ratingSummary = DB::selectOne("
                SELECT 
                    ROUND(AVG(r.rating), 1) AS avg_rating,
                    COUNT(*) AS total_reviews
                FROM reviews r
                WHERE r.product_id = ?
            ", [$product_id]);

            // Rating breakdown
            $ratingBreakdown = DB::select("
                SELECT 
                    r.rating,
                    COUNT(*) AS review_count
                FROM reviews r
                WHERE r.product_id = ?
                GROUP BY r.rating
                ORDER BY r.rating DESC
            ", [$product_id]);

            // Customer reviews (limit 5)
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
                LIMIT 5 OFFSET 0
            ", [$product_id]);

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
                    'rating_summary'  => $ratingSummary ?? ['avg_rating' => null, 'total_reviews' => 0],
                    'rating_breakdown'=> $ratingBreakdown,
                    'recent_reviews'  => $reviews
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }
}
