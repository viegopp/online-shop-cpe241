<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CustomerProfileManagementController extends Controller
{
    public function getProfile(Request $request)
    {
        $token = $request->bearerToken();
        $customer = Cache::get("customer_token:$token");
        $customer_id = $customer['customer_id'];   

        try {
            $profile = DB::selectOne("SELECT 
                c.customer_id,
                u.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone_number,
                u.image_profile_path
            FROM customers c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.customer_id = ?", [$customer_id]);

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found.'
                ], 404);
            }

            $addresses = DB::select("SELECT 
                address_id,
                address_text,
                district,
                province,
                postal_code,
                country,
                phone_number,
                is_default
            FROM addresses
            WHERE customer_id = ?", [$customer_id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'profile' => $profile,
                    'addresses' => $addresses
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        $token = $request->bearerToken();
        $customer = Cache::get("customer_token:$token");
        $user_id = $customer['user_id'];   

        $validator = Validator::make($request->all(), [
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'phone_number'  => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::update("UPDATE users SET 
                first_name = ?,
                last_name = ?,
                email = ?,
                phone_number = ?
            WHERE user_id = ?", [
                $request->first_name,
                $request->last_name,
                $request->email,
                $request->phone_number,
                $user_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id'   => 'required|integer|exists:customers,customer_id',
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'address_text'  => 'required|string|max:255',
            'district'      => 'required|string|max:100',
            'province'      => 'required|string|max:100',
            'postal_code'   => 'required|string|max:10',
            'country'       => 'required|string|max:100',
            'phone_number'  => 'required|string|max:20',
            'is_default'    => 'required|boolean'
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::insert("INSERT INTO addresses (
                customer_id, first_name, last_name, address_text, district, province,
                postal_code, country, phone_number, is_default, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())", [
                $request->customer_id,
                $request->first_name,
                $request->last_name,
                $request->address_text,
                $request->district,
                $request->province,
                $request->postal_code,
                $request->country,
                $request->phone_number,
                $request->is_default
            ]);


            return response()->json([
                'success' => true,
                'message' => 'Address added successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add address.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateAddress(Request $request, $address_id)
    {
        $validator = Validator::make($request->all(), [
            'customer_id'   => 'required|integer|exists:customers,customer_id',
            'address_text'  => 'required|string|max:255',
            'district'      => 'required|string|max:100',
            'province'      => 'required|string|max:100',
            'postal_code'   => 'required|string|max:10',
            'country'       => 'required|string|max:100',
            'phone_number'  => 'required|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::update("UPDATE addresses SET 
                address_text = ?,
                district = ?,
                province = ?,
                postal_code = ?,
                country = ?,
                phone_number = ?
            WHERE address_id = ? AND customer_id = ?", [
                $request->address_text,
                $request->district,
                $request->province,
                $request->postal_code,
                $request->country,
                $request->phone_number,
                $address_id,
                $request->customer_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Address updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update address.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_id'   => 'required|integer|exists:addresses,address_id',
            'customer_id'  => 'required|integer|exists:customers,customer_id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::delete("DELETE FROM addresses WHERE address_id = ? AND customer_id = ?", [
                $request->address_id,
                $request->customer_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Address deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete address.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}