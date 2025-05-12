<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CustomerMyOrderPageController extends Controller
{
    public function getCustomerOrders(Request $request)
    {
        $token = $request->bearerToken();
        $customer = Cache::get("customer_token:$token");
        $customer_id = $customer['customer_id'];   

        $validator = Validator::make(
            array_merge($request->all(), ['customer_id' => $customer_id]),
            [
                'page' => 'nullable|integer|min:1',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $page = max((int)$request->input('page', 1), 1);
        $perPage = 5;
        $offset = ($page - 1) * $perPage;

        try {
            // Fetch orders
            $orders = DB::select("
                SELECT 
                    o.order_id,
                    o.order_date,
                    p.total_amount,
                    s.status_description,
                    pm.method_name AS payment_method
                FROM orders o
                JOIN payments p ON o.payment_id = p.payment_id
                JOIN payment_methods pm ON p.payment_method_id = pm.payment_method_id
                JOIN order_statuses s ON o.status_code = s.status_code
                WHERE o.customer_id = ?
                ORDER BY o.order_date DESC
                LIMIT ? OFFSET ?
            ", [$customer_id, $perPage, $offset]);

            // Get order IDs for thumbnails
            $orderIds = array_column($orders, 'order_id');
            $thumbnails = [];

            if (!empty($orderIds)) {
                $placeholders = implode(',', array_fill(0, count($orderIds), '?'));
                $bindings = $orderIds;

                $thumbnails = DB::select("
                    SELECT 
                        oi.order_id,
                        oi.product_id,
                        p.name,
                        (
                            SELECT image_path 
                            FROM product_images 
                            WHERE product_id = p.product_id
                            LIMIT 1
                        ) AS image_path
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE oi.order_id IN ($placeholders)
                    ORDER BY oi.order_id
                ", $bindings);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'orders' => $orders,
                    'thumbnails' => $thumbnails,
                    'pagination' => [
                        'current_page' => $page,
                        'per_page' => $perPage
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load orders.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}