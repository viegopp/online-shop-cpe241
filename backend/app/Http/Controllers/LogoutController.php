<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function AdminLogout(Request $request)
    {
        $token = $request->bearerToken();
        cache()->forget("admin_token:$token");

        return response()->json([
            'success' => true,
            'message' => 'Logged out'
        ]);
    }

    public function CustomerLogout(Request $request)
    {
        $token = $request->bearerToken();
        cache()->forget("customer_token:$token");

        return response()->json([
            'success' => true,
            'message' => 'Logged out'
        ]);
    }
}
