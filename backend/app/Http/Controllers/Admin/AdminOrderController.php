<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOrderController extends Controller
{
    public function getOrderTracking(Request $request)
    {
        try {
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $orders = DB::select("
                SELECT
                    o.order_id,
                    o.customer_id,
                    pm.method_name AS payment,
                    o.order_date,
                    pay.payment_date,
                    os.status_description AS order_status
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                LEFT JOIN payment_methods AS pm ON pay.payment_method_id = pm.payment_method_id
                LEFT JOIN order_statuses AS os ON o.status_code = os.status_code
                ORDER BY o.order_date DESC
                LIMIT :limit OFFSET :offset
            ", [
                'limit' => $perPage,
                'offset' => $offset
            ]);

            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrderTrackinDetails(Request $request)
    {
        try {
            $orderId = $request->query('order_id');

            if (!$orderId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing order_id in request.'
                ], 400);
            }

            // Get customer details
            $customer = DB::selectOne("
                SELECT 
                    c.customer_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
                    u.email,
                    u.phone_number AS phone
                FROM customers AS c
                JOIN users AS u ON c.user_id = u.user_id
                WHERE c.customer_id = (
                    SELECT customer_id FROM orders WHERE order_id = :order_id
                )
            ", ['order_id' => $orderId]);

            // Get default shipping address
            $address = DB::selectOne("
                SELECT 
                    a.address_id,
                    a.first_name,
                    a.last_name,
                    a.phone_number,
                    a.address_text,
                    a.country,
                    a.province,
                    a.district,
                    a.postal_code
                FROM addresses AS a
                JOIN customers AS c ON a.customer_id = c.customer_id
                WHERE c.customer_id = (
                    SELECT customer_id FROM orders WHERE order_id = :order_id
                )
                AND a.is_default = TRUE
            ", ['order_id' => $orderId]);

            // Get payment info
            $payment = DB::selectOne("
                SELECT 
                    o.order_date,
                    pay.payment_date,
                    pm.method_name AS payment_method
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                LEFT JOIN payment_methods AS pm ON pm.payment_method_id = pay.payment_method_id
                WHERE o.order_id = :order_id
            ", ['order_id' => $orderId]);

            // Get order item details
            $items = DB::select("
                SELECT 
                    oi.product_id,
                    p.name AS product_name,
                    p.price AS unit_price,
                    oi.quantity,
                    COALESCE(pm.discount_percent, 0) AS discount,
                    (p.price * oi.quantity) * (1 - COALESCE(pm.discount_percent, 0) / 100) AS total
                FROM order_items AS oi
                JOIN products AS p ON oi.product_id = p.product_id
                LEFT JOIN promotion_products AS pp ON p.product_id = pp.product_id
                LEFT JOIN promotions AS pm ON pp.promotion_id = pm.promotion_id
                WHERE oi.order_id = :order_id
            ", ['order_id' => $orderId]);

            return response()->json([
                'success' => true,
                'order_id' => (int)$orderId,
                'customer' => $customer,
                'shipping_address' => $address,
                'payment_info' => $payment,
                'order_items' => $items
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve order tracking details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
