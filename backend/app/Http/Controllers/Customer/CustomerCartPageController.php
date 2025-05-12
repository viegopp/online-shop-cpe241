<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerCartPageController extends Controller
{
    public function getCartDetailsByCustomerID($customer_id)
    {
        try {
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

    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|integer|exists:customers,customer_id',
            'product_id'  => 'required|string|exists:products,product_id',
            'quantity'    => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $quantity = $request->input('quantity', 1);

            DB::statement("
                INSERT INTO cart_items (customer_id, product_id, quantity, added_at)
                VALUES (?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), updated_at = NOW()
            ", [
                $request->customer_id,
                $request->product_id,
                $quantity
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateCartItemQuantity(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|integer|exists:customers,customer_id',
            'product_id'  => 'required|string|exists:products,product_id',
            'quantity'    => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if the item exists in the cart first
            $exists = DB::selectOne("
                SELECT 1 FROM cart_items
                WHERE customer_id = ? AND product_id = ?
            ", [
                $request->customer_id,
                $request->product_id
            ]);

            if (!$exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart item not found.'
                ], 404);
            }

            // Proceed to update
            DB::update("
                UPDATE cart_items
                SET quantity = ?, updated_at = NOW()
                WHERE customer_id = ? AND product_id = ?
            ", [
                $request->quantity,
                $request->customer_id,
                $request->product_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function removeFromCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|integer|exists:customers,customer_id',
            'product_id'  => 'required|string|exists:products,product_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $deleted = DB::delete("
                DELETE FROM cart_items
                WHERE customer_id = ? AND product_id = ?
            ", [$request->customer_id, $request->product_id]);

            return response()->json([
                'success' => true,
                'message' => 'Cart item removed.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove product.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
