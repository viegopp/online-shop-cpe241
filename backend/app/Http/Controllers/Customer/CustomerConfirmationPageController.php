<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerConfirmationPageController extends Controller
{
    public function getConfirmationInfo($order_id)
    {
        try {
            // Order Header & Payment Info
            $header = DB::selectOne("SELECT 
                o.order_id,
                o.order_date,
                o.customer_id,
                s.status_description,
                p.total_amount,
                p.payment_date,
                pm.method_name AS payment_method
            FROM orders o
            JOIN payments p ON o.payment_id = p.payment_id
            JOIN payment_methods pm ON p.payment_method_id = pm.payment_method_id
            JOIN order_statuses s ON o.status_code = s.status_code
            WHERE o.order_id = ?", [$order_id]);

            if (!$header) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found.'
                ], 404);
            }

            // Customer Info
            $customer = DB::selectOne("SELECT 
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number
            FROM customers c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.customer_id = (
                SELECT customer_id FROM orders WHERE order_id = ?
            )", [$order_id]);

            // Shipping Address
            $address = DB::selectOne("SELECT 
                address_text,
                postal_code,
                province,
                district
            FROM addresses
            WHERE customer_id = (
                SELECT customer_id FROM orders WHERE order_id = ?
            )
            AND is_default = TRUE
            LIMIT 1", [$order_id]);

            // Ordered Product List
            $items = DB::select("SELECT 
                oi.product_id,
                p.name,
                p.price,
                oi.quantity,
                (p.price * oi.quantity) AS total,
                (
                    SELECT image_path FROM product_images 
                    WHERE product_id = p.product_id LIMIT 1
                ) AS image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?", [$order_id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'order' => $header,
                    'customer' => $customer,
                    'shipping_address' => $address,
                    'items' => $items
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load order confirmation details.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
