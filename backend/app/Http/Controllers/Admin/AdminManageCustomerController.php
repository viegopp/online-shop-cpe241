<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminManageCustomerController extends Controller
{
    public function getCustomerListBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:255',
                'page'   => 'nullable|integer|min:1',
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

            if ($request->filled('search')) {
                $filters .= " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)";
                $term = '%' . $request->search . '%';
                array_push($params, $term, $term, $term, $term);
            }

            // Count total
            $countSql = "SELECT COUNT(*) AS total
                FROM customers c
                JOIN users u ON c.user_id = u.user_id
                WHERE 1=1 $filters
            ";
            $total = DB::selectOne($countSql, $params)->total ?? 0;

            // Pagination
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $params[] = $perPage;
            $params[] = $offset;

            // Main data query
            $dataSql = "
                SELECT 
                    c.customer_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number AS phone,
                    (
                        SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id
                    ) AS total_orders
                FROM customers c
                JOIN users u ON c.user_id = u.user_id
                WHERE 1=1 $filters
                AND u.deleted_at IS NULL
                ORDER BY u.created_at DESC
                LIMIT ? OFFSET ?
            ";

            $customers = DB::select($dataSql, $params);

            return response()->json([
                'success' => true,
                'data' => $customers,
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
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function deleteCustomerByID($customer_id)
    {
        try {
            // Check if customer exists
            $customer = DB::selectOne("SELECT user_id FROM customers WHERE customer_id = ?", [$customer_id]);

            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found.'
                ], 404);
            }

            // Perform soft delete on user
            DB::update("
                UPDATE users 
                SET deleted_at = NOW()
                WHERE user_id = ?
            ", [$customer->user_id]);

            return response()->json([
                'success' => true,
                'message' => "Customer $customer_id soft-deleted successfully."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Deletion failed.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
