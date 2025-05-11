<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AdminManageAdminsController extends Controller
{
    public function getAdminListBy(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:255',
                'role'   => 'nullable|string',
                'page'   => 'nullable|integer|min:1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $filters = "";
            $params = [];

            if ($request->filled('search')) {
                $filters .= " AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.phone_number LIKE ?)";
                $term = '%' . $request->search . '%';
                array_push($params, $term, $term, $term, $term);
            }

            if ($request->filled('role')) {
                $filters .= " AND r.role_name = ?";
                $params[] = $request->role;
            }

            // Count total
            $countSql = "SELECT COUNT(*) AS total
                FROM admins a
                JOIN users u ON a.user_id = u.user_id
                JOIN roles r ON a.role_id = r.role_id
                WHERE 1=1 $filters
            ";
            $total = DB::selectOne($countSql, $params)->total ?? 0;

            // Pagination
            $page = max(1, (int)$request->input('page', 1));
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $params[] = $perPage;
            $params[] = $offset;

            // Main query
            $dataSql = "
                SELECT 
                    a.admin_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number AS phone,
                    r.role_name AS role
                FROM admins a
                JOIN users u ON a.user_id = u.user_id
                JOIN roles r ON a.role_id = r.role_id
                WHERE 1=1 $filters
                AND u.deleted_at IS NULL
                ORDER BY u.created_at DESC
                LIMIT ? OFFSET ?
            ";

            $admins = DB::select($dataSql, $params);

            return response()->json([
                'success' => true,
                'data' => $admins,
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

    public function deleteAdminByID(Request $request, $admin_id)
    {
        try {
            // Auth admin from token
            $token = $request->bearerToken();
            $current = Cache::get("admin_token:$token");

            // Get target admin info
            $target = DB::selectOne("
                SELECT u.user_id, r.role_name
                FROM admins a
                JOIN users u ON a.user_id = u.user_id
                JOIN roles r ON a.role_id = r.role_id
                WHERE a.admin_id = ?
            ", [$admin_id]);

            if (!$target) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found.'
                ], 404);
            }

            if ($target->role_name === 'Super Admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Super Admin cannot delete another Super Admin.'
                ], 403);
            }

            // Soft delete user
            DB::update("
                UPDATE users 
                SET deleted_at = NOW()
                WHERE user_id = ?
            ", [$target->user_id]);

            return response()->json([
                'success' => true,
                'message' => "Admin $admin_id soft-deleted successfully."
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