<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerCheckoutPageController extends Controller
{
    public function getCheckoutInfo($customer_id)
    {
        try {
            $profile = DB::selectOne("SELECT 
                c.customer_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number
            FROM customers c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.customer_id = ?", [$customer_id]);

            $address = DB::selectOne("SELECT 
                address_text,
                postal_code,
                district,
                province
            FROM addresses
            WHERE customer_id = ? AND is_default = TRUE
            LIMIT 1", [$customer_id]);

            $paymentMethods = DB::select("SELECT 
                payment_method_id,
                method_name
            FROM payment_methods");

            $summary = DB::selectOne("SELECT 
                SUM(p.price * ci.quantity) AS subtotal,
                0.00 AS shipping_fee,
                SUM(p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.customer_id = ?", [$customer_id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'profile' => $profile,
                    'default_address' => $address,
                    'payment_methods' => $paymentMethods,
                    'summary' => $summary,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load checkout information.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|integer|exists:customers,customer_id',
            'payment_method_id' => 'required|integer|exists:payment_methods,payment_method_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $customer_id = $request->customer_id;
        $payment_method_id = $request->payment_method_id;

        try {
            DB::beginTransaction();

            // Calculate total
            $summary = DB::selectOne("SELECT 
                SUM(p.price * ci.quantity) AS subtotal,
                SUM(p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.customer_id = ?", [$customer_id]);

            if (!$summary || !$summary->total) {
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

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully.',
                'order_id' => $order_id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Order placement failed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
