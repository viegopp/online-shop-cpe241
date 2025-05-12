<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerFlashSalePageController extends Controller
{
    // Active promotion banners (for Flash Sale Page header)
    public function getActivePromotions()
    {
        try {
            $results = DB::select("
                SELECT 
                    promotion_id,
                    banner_path,
                    release_date,
                    expiry_date,
                    discount_percent
                FROM promotions
                WHERE NOW() BETWEEN release_date AND expiry_date
            ");

            return response()->json([
                'success' => true,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch promotions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Flash sale product list with pagination
    public function getFlashSaleProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid pagination.',
                'errors' => $validator->errors()
            ], 422);
        }

        $page = max((int)$request->input('page', 1), 1);
        $limit = 18;
        $offset = ($page - 1) * $limit;

        try {
            $products = DB::select("
                SELECT 
                    p.product_id,
                    p.name,
                    p.price AS original_price,
                    ROUND(p.price * (1 - pr.discount_percent / 100), 2) AS discounted_price,
                    (
                        SELECT image_path
                        FROM product_images
                        WHERE product_id = p.product_id
                        LIMIT 1
                    ) AS image_path,
                    pr.promotion_id
                FROM promotion_products pp
                JOIN products p ON pp.product_id = p.product_id
                JOIN promotions pr ON pp.promotion_id = pr.promotion_id
                WHERE NOW() BETWEEN pr.release_date AND pr.expiry_date
                ORDER BY p.created_at DESC
                LIMIT ? OFFSET ?
            ", [$limit, $offset]);

            return response()->json([
                'success' => true,
                'data' => $products,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit
                ]
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
