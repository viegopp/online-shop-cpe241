<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CustomerCheckoutPageController extends Controller
{
    public function getCheckoutInfo(Request $request)
    {
        try {
            // Step 1: Authenticated customer check
            $token = $request->bearerToken();
            $customer = Cache::get("customer_token:$token");
    
            if (!$customer || !isset($customer['customer_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized or session expired.'
                ], 401);
            }
    
            $customer_id = $customer['customer_id'];
    
            // Step 2: Profile
            $profile = DB::selectOne("
                SELECT 
                    c.customer_id,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone_number
                FROM customers c
                JOIN users u ON c.user_id = u.user_id
                WHERE c.customer_id = ?
            ", [$customer_id]);
    
            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer profile not found.'
                ], 404);
            }
    
            // Step 3: Default address (can be null)
            $address = DB::selectOne("
                SELECT 
                    address_text,
                    postal_code,
                    district,
                    province
                FROM addresses
                WHERE customer_id = ? AND is_default = TRUE
                LIMIT 1
            ", [$customer_id]);
    
            // Step 4: Cart summary (exclude unavailable products)
            $summary = DB::selectOne("
                SELECT 
                    SUM(p.price * ci.quantity) AS subtotal,
                    0.00 AS shipping_fee,
                    SUM(p.price * ci.quantity) AS total
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.customer_id = ?
                AND p.is_available = TRUE
                AND p.deleted_at IS NULL
            ", [$customer_id]);
    
            if (!$summary || $summary->subtotal === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid products in cart.'
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'data' => [
                    'profile' => $profile,
                    'default_address' => $address,
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
                'message' => 'Failed to load checkout information.',
                'error' => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }
    
    public function placeOrder(Request $request)
    {
        $token = $request->bearerToken();
        $customer = Cache::get("customer_token:$token");
    
        if (!$customer || !isset($customer['customer_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized or session expired.'
            ], 401);
        }
    
        $customer_id = $customer['customer_id'];
    
        $validator = Validator::make($request->all(), [
            'payment_method_id' => 'required|integer|exists:payment_methods,payment_method_id'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }
    
        $payment_method_id = $request->payment_method_id;
    
        try {
            DB::statement("START TRANSACTION");
    
            // Calculate total
            $summary = DB::selectOne("SELECT 
                SUM(p.price * ci.quantity) AS subtotal,
                SUM(p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.customer_id = ?", [$customer_id]);
    
            if (!$summary || !$summary->total) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty. Cannot place order.'
                ], 400);
            }
    
            // Insert payment
            DB::insert("INSERT INTO payments (payment_method_id, total_amount, payment_date)
                        VALUES (?, ?, NOW())", [$payment_method_id, $summary->total]);
            $payment_id = DB::getPdo()->lastInsertId();
    
            // Insert order
            DB::insert("INSERT INTO orders (customer_id, order_date, payment_id, status_code)
                        VALUES (?, NOW(), ?, 1)", [$customer_id, $payment_id]);
            $order_id = DB::getPdo()->lastInsertId();
    
            // Insert order items
            $cartItems = DB::select("SELECT product_id, quantity FROM cart_items WHERE customer_id = ?", [$customer_id]);
    
            foreach ($cartItems as $item) {
                DB::insert("INSERT INTO order_items (order_id, product_id, quantity)
                            VALUES (?, ?, ?)", [$order_id, $item->product_id, $item->quantity]);
            }
    
            // Clear cart
            DB::delete("DELETE FROM cart_items WHERE customer_id = ?", [$customer_id]);
    
            DB::statement("COMMIT");
    
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'order_id' => $order_id
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");
            return response()->json([
                'success' => false,
                'message' => 'Order placement failed.',
                'error'   => app()->environment('local') ? $e->getMessage() : 'Unexpected server error.'
            ], 500);
        }
    }    
}
