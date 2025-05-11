<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminUserManangementController extends Controller
{
    // Basic paginated admin list
    public function getManageAdmins(Request $request)
    {
        try {
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $admins = DB::select("
                SELECT 
                    a.admin_id, 
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number,
                    r.role_name
                FROM admins AS a
                JOIN users AS u ON a.user_id = u.user_id
                JOIN roles AS r ON a.role_id = r.role_id
                LIMIT :limit OFFSET :offset
            ", [
                'limit' => $perPage,
                'offset' => $offset
            ]);

            return response()->json([
                'success' => true,
                'data' => $admins
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve admin list.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Admin search and role filter
    public function searchAdmins(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $role = $request->query('role', null);
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $query = "
                SELECT 
                    a.admin_id, 
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number,
                    r.role_name
                FROM admins AS a
                JOIN users AS u ON a.user_id = u.user_id
                JOIN roles AS r ON a.role_id = r.role_id
                WHERE (
                    a.admin_id LIKE :search OR
                    CONCAT(u.first_name, ' ', u.last_name) LIKE :search OR
                    u.email LIKE :search OR
                    u.phone_number LIKE :search
                )";

            // Add role filtering if provided
            if ($role) {
                $query .= " AND r.role_name = :role";
                $params = [
                    'search' => '%' . $search . '%',
                    'role' => $role,
                    'limit' => $perPage,
                    'offset' => $offset
                ];
            } else {
                $params = [
                    'search' => '%' . $search . '%',
                    'limit' => $perPage,
                    'offset' => $offset
                ];
            }

            $query .= " LIMIT :limit OFFSET :offset";

            $admins = DB::select($query, $params);

            return response()->json([
                'success' => true,
                'data' => $admins
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search admin list.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // 3. Basic customer list with total orders
    public function getManageCustomers(Request $request)
    {
        try {
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $customers = DB::select("
                SELECT 
                    c.customer_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number,
                    COUNT(DISTINCT o.order_id) AS total_orders
                FROM customers AS c
                JOIN users AS u ON c.user_id = u.user_id
                JOIN orders AS o ON c.customer_id = o.customer_id
                GROUP BY c.customer_id, u.first_name, u.last_name, u.email, u.phone_number
                LIMIT :limit OFFSET :offset
            ", [
                'limit' => $perPage,
                'offset' => $offset
            ]);

            return response()->json([
                'success' => true,
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve customer list.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 4. Search/filter customer list by keyword and order count range
    public function searchCustomers(Request $request)
    {
        try {
            $search = $request->query('search', '');
            $min = (int) $request->query('min_orders', 0);
            $max = (int) $request->query('max_orders', 9999);
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $customers = DB::select("
                SELECT 
                    c.customer_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number,
                    COUNT(DISTINCT o.order_id) AS total_orders
                FROM customers AS c
                JOIN users AS u ON c.user_id = u.user_id
                JOIN orders AS o ON c.customer_id = o.customer_id
                WHERE (
                    c.customer_id LIKE :search OR
                    CONCAT(u.first_name, ' ', u.last_name) LIKE :search OR
                    u.email LIKE :search OR
                    u.phone_number LIKE :search
                )
                GROUP BY c.customer_id, u.first_name, u.last_name, u.email, u.phone_number
                HAVING COUNT(DISTINCT o.order_id) BETWEEN :min_orders AND :max_orders
                LIMIT :limit OFFSET :offset
            ", [
                'search' => '%' . $search . '%',
                'min_orders' => $min,
                'max_orders' => $max,
                'limit' => $perPage,
                'offset' => $offset
            ]);

            return response()->json([
                'success' => true,
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search customer list.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
