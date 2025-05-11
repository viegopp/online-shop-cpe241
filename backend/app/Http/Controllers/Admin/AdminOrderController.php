<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminOrderController extends Controller
{
    public function getOrderDetailBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search'     => 'nullable|string|max:255',
                'payment'    => 'nullable|string',
                'status'     => 'nullable|string',
                'start_date' => 'nullable|date',
                'end_date'   => 'nullable|date',
                'page'       => 'nullable|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error.',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $filters = "";
            $params = [];

            // Search by order ID or customer ID
            if ($request->filled('search')) {
                $filters .= " AND (o.order_id = ? OR o.customer_id = ?)";
                $searchTerm = (int)$request->search;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            // Payment method filter
            if ($request->filled('payment')) {
                $filters .= " AND pm.method_name = ?";
                $params[] = $request->payment;
            }

            // Order status filter
            if ($request->filled('status')) {
                $filters .= " AND os.status_description = ?";
                $params[] = $request->status;
            }

            // Date range filters
            if ($request->filled('start_date')) {
                $filters .= " AND DATE(o.order_date) >= ?";
                $params[] = $request->start_date;
            }

            if ($request->filled('end_date')) {
                $filters .= " AND DATE(o.order_date) <= ?";
                $params[] = $request->end_date;
            }

            // Count query
            $countSql = "SELECT COUNT(*) AS total
                FROM orders o
                LEFT JOIN payments p ON o.payment_id = p.payment_id
                LEFT JOIN payment_methods pm ON p.payment_method_id = pm.payment_method_id
                LEFT JOIN order_statuses os ON o.status_code = os.status_code
                WHERE 1=1 $filters
            ";

            $totalResult = DB::select($countSql, $params);
            $total = $totalResult[0]->total ?? 0;

            // Pagination
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $params[] = $perPage;
            $params[] = $offset;

            // Data query
            $dataSql = "SELECT 
                    o.order_id,
                    o.customer_id,
                    pm.method_name AS payment_method,
                    DATE_FORMAT(o.order_date, '%b %d, %Y') AS order_date,
                    DATE_FORMAT(p.payment_date, '%b %d, %Y') AS payment_date,
                    os.status_description AS order_status
                FROM orders o
                LEFT JOIN payments p ON o.payment_id = p.payment_id
                LEFT JOIN payment_methods pm ON p.payment_method_id = pm.payment_method_id
                LEFT JOIN order_statuses os ON o.status_code = os.status_code
                WHERE 1=1 $filters
                ORDER BY o.order_date DESC
                LIMIT ? OFFSET ?
            ";

            $orders = DB::select($dataSql, $params);

            return response()->json([
                'success' => true,
                'data' => $orders,
                'pagination' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getOrderDetailByID(Request $request, $order_id)
    {
        try {
            // 1. Get order + customer + address + payment info
            $order = DB::selectOne("SELECT 
                    o.order_id,
                    o.customer_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
                    u.email,
                    u.phone_number AS phone,
    
                    a.address_text AS address,
                    a.postal_code AS zip_code,
                    a.district,
                    a.province,
    
                    DATE_FORMAT(o.order_date, '%b %d, %Y %H:%i') AS order_date,
                    DATE_FORMAT(p.payment_date, '%b %d, %Y %H:%i') AS payment_date,
                    pm.method_name AS payment_method,
                    os.status_description AS order_status
    
                FROM orders o
                LEFT JOIN customers AS c ON o.customer_id = c.customer_id
                LEFT JOIN users AS u ON c.user_id = u.user_id
                LEFT JOIN addresses AS a ON c.customer_id = a.customer_id AND a.is_default = 1
                LEFT JOIN payments AS p ON o.payment_id = p.payment_id
                LEFT JOIN payment_methods AS pm ON p.payment_method_id = pm.payment_method_id
                LEFT JOIN order_statuses AS os ON o.status_code = os.status_code
                WHERE o.order_id = ?
            ", [$order_id]);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found.'
                ], 404);
            }

            // 2. Get items with calculations
            $items = DB::select("SELECT 
                oi.product_id,
                p.name AS product_name,
                p.price AS unit_price,
                oi.quantity,
                ROUND(p.price * oi.quantity, 2) AS total
            FROM order_items AS oi
            LEFT JOIN products AS p ON oi.product_id = p.product_id
            WHERE oi.order_id = ?
            ", [$order_id]);

            // 3. Get summary
            $summary = DB::selectOne("SELECT
                    ROUND(SUM(p.price * oi.quantity), 2) AS subtotal,
                    ROUND(SUM(p.price * oi.quantity) - (
                        SELECT pay2.total_amount
                        FROM orders o2
                        JOIN payments pay2 ON o2.payment_id = pay2.payment_id
                        WHERE o2.order_id = ?
                        LIMIT 1
                    ), 2) AS discount,
                    0.00 AS shipping_fee,
                    (
                        SELECT ROUND(pay2.total_amount, 2)
                        FROM orders o2
                        JOIN payments pay2 ON o2.payment_id = pay2.payment_id
                        WHERE o2.order_id = ?
                        LIMIT 1
                    ) AS total
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = ?
            ", [$order_id, $order_id, $order_id]);


            return response()->json([
                'success' => true,
                'order' => $order,
                'items' => $items,
                'summary' => [
                    'subtotal' => number_format($summary->subtotal, 2),
                    'discount' => number_format($summary->discount, 2),
                    'shipping_fee' => number_format($summary->shipping_fee, 2),
                    'total' => number_format($summary->total, 2),
                ]
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
