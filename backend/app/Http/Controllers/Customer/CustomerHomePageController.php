<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerHomePageController extends Controller
{
    // Hero Section: Active promotions with banners
    public function getHeroPromotions()
    {
        try {
            $results = DB::select("
                SELECT 
                    p.promotion_id,
                    p.name,
                    p.banner_path,
                    p.release_date AS start,
                    p.expiry_date AS expire
                FROM promotions p
                WHERE 
                    NOW() BETWEEN p.release_date AND p.expiry_date
                    AND p.is_available = 1;
            ");        

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch promotions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Hot Products Section: Top 10 by avg rating
    public function getHotProducts()
    {
        try {
            $results = DB::select("
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    MIN(pi.image_path) AS image_path,
                    COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating
                FROM products p
                LEFT JOIN reviews r ON p.product_id = r.product_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id
                WHERE p.is_available = TRUE AND p.deleted_at IS NULL
                GROUP BY p.product_id, p.name, p.price
                ORDER BY avg_rating DESC
                LIMIT 6
            ");

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hot products.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Flash Sale Section: Active flash sale items with discounted price
    public function getFlashSalesProduct()
    {
        try {
            $results = DB::select("
                SELECT 
                    pr.product_id,
                    p.name,
                    p.price AS original_price,
                    ROUND(p.price * (1 - promo.discount_percent / 100), 2) AS discounted_price,
                    MIN(pi.image_path) AS image_path,  -- in case of multiple images, use MIN or MAX
                    promo.discount_percent,
                    promo.expiry_date,
                    COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating
                FROM promotion_products pr
                JOIN promotions promo 
                    ON pr.promotion_id = promo.promotion_id
                JOIN products p 
                    ON pr.product_id = p.product_id
                LEFT JOIN product_images pi 
                    ON p.product_id = pi.product_id
                LEFT JOIN reviews r 
                    ON p.product_id = r.product_id
                WHERE 
                    NOW() BETWEEN promo.release_date AND promo.expiry_date
                    AND promo.is_available = 1
                    AND p.deleted_at IS NULL
                    AND p.is_available = TRUE
                GROUP BY 
                    pr.product_id, p.name, p.price, 
                    promo.discount_percent, promo.expiry_date
                ORDER BY 
                    avg_rating DESC
                LIMIT 6;
            ");
        

            return response()->json([
                'success' => true,
                'data' => $results,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch flash sale products.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}