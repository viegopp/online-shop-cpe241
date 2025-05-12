<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerCartPageController extends Controller
{
    public function getCartDetailsByCustomerID($customer_id)
    {
        try {
            // ========== Cart Item List ==========
            $cartItems = DB::select("
                SELECT 
                    ci.product_id,
                    p.name,
                    p.price,
                    ci.quantity,
                    (p.price * ci.quantity) AS total,
                    (
                        SELECT pi.image_path
                        FROM product_images pi
                        WHERE pi.product_id = p.product_id
                        LIMIT 1
                    ) AS image_path
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.customer_id = ?
            ", [$customer_id]);

            // ========== Order Summary (No Tax) ==========
            $summary = DB::selectOne("
                SELECT 
                    SUM(p.price * ci.quantity) AS subtotal,
                    0.00 AS shipping_fee,
                    SUM(p.price * ci.quantity) AS total
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.customer_id = ?
            ", [$customer_id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $cartItems,
                    'summary' => [
                        'subtotal'     => (float)($summary->subtotal ?? 0),
                        'shipping_fee' => (float)($summary->shipping_fee ?? 0),
                        'total'        => (float)($summary->total ?? 0)
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cart details.',
                'error' => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }
}
