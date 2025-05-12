<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerSearchPageController extends Controller
{
    public function searchProducts(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_id'     => 'nullable|integer|exists:categories,category_id',
                'manufacturer_id' => 'nullable|string|exists:manufacturers,manufacturer_id',
                'min_price'       => 'nullable|numeric|min:0',
                'max_price'       => 'nullable|numeric|min:0',
                'min_rating'      => 'nullable|numeric|min:0|max:5',
                'page'            => 'nullable|integer|min:1',
            ]);

            // Manual logic: price range consistency
            $validator->after(function ($validator) use ($request) {
                if (
                    $request->filled('min_price') &&
                    $request->filled('max_price') &&
                    $request->min_price > $request->max_price
                ) {
                    $validator->errors()->add('min_price', 'min_price cannot be greater than max_price.');
                }
            });

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $category_id     = $request->input('category_id');
            $manufacturer_id = $request->input('manufacturer_id');
            $min_price       = $request->input('min_price', 0);
            $max_price       = $request->input('max_price', 999999);
            $min_rating      = $request->input('min_rating', 0);
            $page            = max((int) $request->input('page', 1), 1);
            $limit           = 24;
            $offset          = ($page - 1) * $limit;

            $sql = "
                SELECT 
                    p.product_id,
                    p.name,
                    p.price,
                    (
                        SELECT pi.image_path
                        FROM product_images pi
                        WHERE pi.product_id = p.product_id
                        LIMIT 1
                    ) AS image_path,
                    ROUND(AVG(r.rating), 1) AS avg_rating
                FROM products p
                LEFT JOIN reviews r ON p.product_id = r.product_id
                WHERE p.is_available = TRUE
                AND (:category_id_filter IS NULL OR p.category_id = :category_id_match)
                AND (:manufacturer_id_filter IS NULL OR p.manufacturer_id = :manufacturer_id_match)
                AND (p.price BETWEEN :min_price AND :max_price)
                GROUP BY p.product_id, p.name, p.price
                HAVING avg_rating >= :min_rating
                ORDER BY p.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            $products = DB::select($sql, [
                'category_id_filter'     => $category_id,
                'category_id_match'      => $category_id,
                'manufacturer_id_filter' => $manufacturer_id,
                'manufacturer_id_match'  => $manufacturer_id,
                'min_price'              => $min_price,
                'max_price'              => $max_price,
                'min_rating'             => $min_rating,
                'limit'                  => $limit,
                'offset'                 => $offset,
            ]);

            return response()->json([
                'success' => true,
                'data' => $products,
                'pagination' => [
                    'current_page' => $page,
                    'per_page'     => $limit,
                    'offset'       => $offset
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search products.',
                'error'   => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }
}