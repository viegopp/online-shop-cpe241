<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CustomerAuthController extends Controller
{
    // public function register(Request $request): JsonResponse
    // {
    //     DB::beginTransaction();

    //     try {
    //         // Raw SQL to insert a user
    //         $userId = DB::selectOne("
    //             INSERT INTO users (first_name, last_name, gender, email, password, phone_number)
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    //             ", [
    //             $request->first_name,
    //             $request->last_name,
    //             $request->gender,
    //             $request->email,
    //             $request->password,
    //             $request->phone_number,
    //         ]);

    //         // After inserting the user, we get the inserted user ID using lastInsertId() from DB
    //         $userId = DB::getPdo()->lastInsertId();

    //         // Raw SQL to insert into customers table
    //         DB::statement("
    //             INSERT INTO customers (user_id)
    //             VALUES (?)
    //         ", [$userId]);

    //         DB::commit();

    //         return response()->json([
    //             'status' => 'success',
    //             'message' => 'Registration successful.',
    //         ]);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Registration failed.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

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
            // Find customer by email
            $customer = DB::selectOne("
                SELECT
                    u.user_id,
                    c.customer_id,
                    u.password,
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.image_profile_path
                FROM customers c
                JOIN users u ON u.user_id = c.user_id
                WHERE u.email = ? AND u.deleted_at IS NULL
                LIMIT 1
            ", [$request->email]);
    
            // Check if customer exists
            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 403);
            }
    
            // Directly compare plain-text passwords (not secure in production!)
            if ($request->password !== $customer->password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wrong credentials'
                ], 401);
            }
    
            // Generate token
            $token = Str::uuid();
    
            // Store token in cache for 1 hour
            Cache::put("customer_token:$token", [
                'user_id' => $customer->user_id,
                'customer_id' => $customer->customer_id,
                'name' => $customer->name,
                'image_path' => $customer->image_profile_path,
            ], now()->addHour());
    
            // Return response
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'token' => $token,
                    'user_id' => $customer->user_id,
                    'customer_id' => $customer->customer_id,
                    'name' => $customer->name,
                    'image_path' => $customer->image_profile_path,
                ]
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }    
}
