<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;


class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            // Find admin by email
            $admins = DB::select("
                SELECT
                u.user_id,
                a.admin_id,
                u.password,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.image_profile_path,
                r.role_name
                FROM admins a
                JOIN users u ON u.user_id = a.user_id
                JOIN roles r ON r.role_id = a.role_id
                WHERE u.email = ? AND u.deleted_at IS NULL
                LIMIT 1
            ", [$request->email]);

            // Check if an admin exists
            $admin = $admins ? $admins[0] : null;

            // Check if admin exists
            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not an admin or user not found'
                ], 403);
            }

            // Directly compare plain-text passwords (not secure!)
            if ($request->password !== $admin->password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wrong credentials'
                ], 401);
            }

            // Generate token
            $token = Str::uuid();

            // Store token in cache for 1 hour
            Cache::put("admin_token:$token", [
                'user_id' => $admin->user_id,
                'admin_id' => $admin->admin_id,
                'name' => $admin->name,
                'image_path' => $admin->image_profile_path,
                'role' => $admin->role_name
            ], now()->addHour());

            // Return response
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'token' => $token,
                    'user_id' => $admin->user_id,
                    'admin_id' => $admin->admin_id,
                    'name' => $admin->name,
                    'image_path' => $admin->image_profile_path,
                    'role' => $admin->role_name
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
