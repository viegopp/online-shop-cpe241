<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class AdminProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            // Get admin from token
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");

            $admin_id = $admin['admin_id'];

            $adminData = DB::selectOne("
                SELECT 
                    a.admin_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.email,
                    u.phone_number,
                    u.gender,
                    u.image_profile_path,
                    r.role_name
                FROM admins a
                JOIN users u ON a.user_id = u.user_id
                JOIN roles r ON a.role_id = r.role_id
                WHERE a.admin_id = ? AND u.deleted_at IS NULL
            ", [$admin_id]);

            if (!$adminData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $adminData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $admin = Cache::get("admin_token:$token");

            $admin_id = $admin['admin_id'];

            $validator = Validator::make($request->all(), [
                'first_name'         => 'nullable|string|max:50',
                'last_name'          => 'nullable|string|max:50',
                'email'              => 'nullable|email|max:255',
                'phone_number'       => 'nullable|string|regex:/^[0-9]{10,15}$/',
                'role_name'          => 'nullable|string|exists:roles,role_name',
                'image_profile_path' => 'nullable|string|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $validator->errors()
                ], 422);
            }

            $adminRecord = DB::selectOne("SELECT user_id FROM admins WHERE admin_id = ?", [$admin_id]);
            if (!$adminRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found.'
                ], 404);
            }

            $user_id = $adminRecord->user_id;

            $userData = array_filter($request->only([
                'first_name',
                'last_name',
                'email',
                'phone_number',
                'image_profile_path',
            ]));

            if (!empty($userData)) {
                $setClause = implode(', ', array_map(fn($key) => "$key = ?", array_keys($userData)));
                DB::update("UPDATE users SET $setClause WHERE user_id = ?", [...array_values($userData), $user_id]);
            }

            if ($request->filled('role_name')) {
                $role = DB::selectOne("SELECT role_id FROM roles WHERE role_name = ?", [$request->role_name]);
                if (!$role) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid role name.'
                    ], 400);
                }
                DB::update("UPDATE admins SET role_id = ? WHERE admin_id = ?", [$role->role_id, $admin_id]);
            }

            return response()->json([
                'success' => true,
                'message' => "Profile updated successfully."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Update failed.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
