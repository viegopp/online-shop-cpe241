<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerOrderDetailController extends Controller
{
    public function getOrderDetail($order_id)
    {
        try {
            // Step 1: Order Header + Payment + Status
            $header = DB::selectOne("SELECT 
                o.order_id,
                o.order_date,
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

            // Step 2: Ordered Items
            $items = DB::select("SELECT 
                oi.product_id,
                pr.name,
                oi.quantity,
                pr.price,
                (oi.quantity * pr.price) AS item_total
            FROM order_items oi
            JOIN products pr ON oi.product_id = pr.product_id
            WHERE oi.order_id = ?", [$order_id]);

            // Step 3: Order Tracking
            $tracking = DB::selectOne("SELECT 
                o.order_id,
                o.order_date,
                o.status_code,
                s.status_description
            FROM orders o
            JOIN order_statuses s ON o.status_code = s.status_code
            WHERE o.order_id = ?", [$order_id]);

            // Step 4: Shipping Address
            $address = DB::selectOne("SELECT 
                address_text,
                district,
                province,
                postal_code,
                country
            FROM addresses
            WHERE customer_id = (
                SELECT customer_id FROM orders WHERE order_id = ?
            )
            AND is_default = TRUE
            LIMIT 1", [$order_id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'order_header' => $header,
                    'items' => $items,
                    'tracking' => $tracking,
                    'shipping_address' => $address
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load order detail.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
