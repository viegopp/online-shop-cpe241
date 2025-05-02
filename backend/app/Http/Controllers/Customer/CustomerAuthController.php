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
            $customer = DB::select("
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

            // Check if an admin exists
            $customer = $customer ? $customer[0] : null;

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
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function register(Request $request)
    {
        DB::statement("START TRANSACTION");

        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'first_name'   => 'required',
                'last_name'    => 'required',
                'email'        => 'required|email',
                'password'     => 'required|min:8',
                'phone_number' => 'required|numeric|digits_between:7,15'
            ]);

            $errors = $validator->errors();

            // Check for existing email only if email is valid
            if (!$errors->has('email')) {
                $existingEmail = DB::select("SELECT COUNT(*) as count FROM users WHERE email = ?", [$request->email]);
                if ($existingEmail && $existingEmail[0]->count > 0) {
                    $errors->add('email', 'Email already taken.');
                }
            }

            if (!$errors->has('phone_number')) {
                $existingPhone = DB::select("SELECT COUNT(*) as count FROM users WHERE phone_number = ?", [$request->phone_number]);
                if ($existingPhone && $existingPhone[0]->count > 0) {
                    $errors->add('phone_number', 'Phone number already taken.');
                }
            }

            if ($errors->any()) {
                DB::statement("ROLLBACK");
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors'  => $errors
                ], 400);
            }

            $gender = $request->gender ?: 'other';
            $image_profile_path = $request->image_profile_path ?: 'https://i.pravatar.cc/300';

            // Insert into users
            DB::statement("
            INSERT INTO users (first_name, last_name, gender, image_profile_path, email, password, phone_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ", [
                    $request->first_name,
                    $request->last_name,
                    $gender,
                    $image_profile_path,
                    $request->email,
                    $request->password,
                    $request->phone_number
                ]);

            // Get user_id
            $userRow = DB::selectOne("SELECT user_id FROM users WHERE email = ?", [$request->email]);
            if (!$userRow) {
                throw new \Exception("User lookup after insert failed.");
            }

            $userId = $userRow->user_id;

            // Insert into customers
            $inserted = DB::insert("INSERT INTO customers (user_id) VALUES (?)", [$userId]);
            if (!$inserted) {
                throw new \Exception("Customer insert failed.");
            }

            DB::statement("COMMIT");

            return response()->json([
                'success' => true,
                'message' => 'Registration successful.'
            ]);
        } catch (\Exception $e) {
            DB::statement("ROLLBACK");

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
