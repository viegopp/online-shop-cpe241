<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function getProductDetails ()
    {
        try {
            $product = DB::select("
                SELECT
                    p.product_id,
                    p.name AS product_name,
                    p.is_available AS available,
                    c.category_name AS category,
                    p.stock_quantity AS stocks
                FROM products AS p
                JOIN categories AS c ON p.category_id = c.category_id
                LIMIT 5 OFFSET 0;
            ");
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductDetailsWithFilter (Request $request)
    {
        try {
            $product = DB::select("
                SELECT
                    p.product_id,
                    p.name AS product_name,
                    p.is_available AS available,
                    c.category_name AS category,
                    p.stock_quantity AS stocks
                FROM products AS p
                JOIN categories AS c ON p.category_id = c.category_id
                WHERE 
                    (p.product_id LIKE '%search_term%' OR
                    p.name LIKE '%search_term%' OR
                    c.category_name LIKE '%search_term%')
                    AND p.is_available = filter_is_available
                    AND p.stock_quantity BETWEEN min_quantity AND max_quantity
                LIMIT 5 OFFSET 0;
            ");
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductDetailsById (Request $request)
    {
        try {
            // Validate the request data invalid product ID
            $request->validate([
                'product_id' => 'required|integer|exists:products,product_id',
            ]);
            $product = DB::select("
                SELECT
                    p.name AS product_name,
                    p.product_id,
                    m.manufacturer_name AS manufacturer,
                    p.description,
                    p.price,
                    p.stock_quantity AS stocks,
                    p.is_available AS available,
                    c.category_name AS category,
                    GROUP_CONCAT(pi.image_path SEPARATOR ', ') AS image_paths
                FROM products AS p
                JOIN categories AS c ON p.category_id = c.category_id
                JOIN manufacturers AS m ON p.manufacturer_id = m.manufacturer_id
                JOIN product_images AS pi ON p.product_id = pi.product_id
                WHERE p.product_id = ?  -- selected product
                GROUP BY p.product_id;
            ", [$request->product_id]);
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductCards (Request $request)
    {
        try {
            // Validate the request data invalid product ID
            $request->validate([
                'page' => 'required|integer|min:1',
            ]);
            $offset = ($request->page - 1) * 10; //  10 products per page
            $product = DB::select("
                SELECT
                    p.name AS product_name,
                    p.price,
                    (SELECT pi.image_path 
                     FROM product_images pi 
                     WHERE pi.product_id = p.product_id 
                     LIMIT 1) AS image_path,  -- First image
                    ROUND(AVG(r.rating), 1) AS average_rating
                FROM products AS p
                LEFT JOIN reviews AS r ON p.product_id = r.product_id
                GROUP BY p.product_id
                LIMIT 10 OFFSET ?;
            ", [$offset]);
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductCardsWithFilter (Request $request)
    {
        try {
            // Validate the request data invalid product ID
            $request->validate([
                'page' => 'required|integer|min:1',
            ]);
            $offset = ($request->page - 1) * 10; //  10 products per page
            $product = DB::select("
                SELECT
                    p.name AS product_name,
                    p.price,
                    (SELECT pi.image_path 
                     FROM product_images pi 
                     WHERE pi.product_id = p.product_id 
                     LIMIT 1) AS image_path,  -- First image
                    ROUND(AVG(r.rating), 1) AS average_rating
                FROM products AS p
                LEFT JOIN reviews AS r ON p.product_id = r.product_id
                WHERE
                    (p.product_id LIKE '%search_term%' OR
                     p.name LIKE '%search_term%')
                    AND p.price BETWEEN min_price AND max_price
                GROUP BY p.product_id
                HAVING
                    average_rating BETWEEN min_rating AND max_rating
                LIMIT 10 OFFSET ?;
            ", [$offset]);
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductDetailsWithReview (Request $request)
    {
        try {
            // Validate the request data invalid product ID
            $request->validate([
                'product_id' => 'required|integer|exists:products,product_id',
            ]);
            $product = DB::select("
                SELECT
                    p.product_id,
                    p.name AS product_name,
                    (SELECT pi.image_path 
                     FROM product_images pi 
                     WHERE pi.product_id = p.product_id 
                     LIMIT 1) AS image_path,  -- First image as thumbnail
                    COUNT(r.review_id) AS total_reviews,
                    ROUND(AVG(r.rating), 1) AS average_rating,
                    COUNT(CASE WHEN r.rating = 1 THEN 1 END) AS rating_1,
                    COUNT(CASE WHEN r.rating = 2 THEN 1 END) AS rating_2,
                    COUNT(CASE WHEN r.rating = 3 THEN 1 END) AS rating_3,
                    COUNT(CASE WHEN r.rating = 4 THEN 1 END) AS rating_4,
                    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS rating_5
                FROM products AS p
                LEFT JOIN reviews AS r ON p.product_id = r.product_id
                WHERE p.product_id = ?  -- selected product
                GROUP BY p.product_id;
            ", [$request->product_id]);
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getProductReviews (Request $request)
    {
        try {
            // Validate the request data invalid product ID
            $request->validate([
                'product_id' => 'required|integer|exists:products,product_id',
            ]);
            $product = DB::select("
                SELECT
                    r.comment AS review_comment,
                    r.rating AS review_stats,
                    r.created_at AS review_date,
                    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
                    r.customer_id,
                    r.reply_comment AS reply_comment
                FROM reviews AS r
                JOIN customers AS c ON r.customer_id = c.customer_id
                JOIN users AS u ON c.user_id = u.user_id
                WHERE r.product_id = ?  -- selected product
                LIMIT 5 OFFSET 0;
            ", [$request->product_id]);
            return response()->json([
                'success' => true,
                'data' => $product
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