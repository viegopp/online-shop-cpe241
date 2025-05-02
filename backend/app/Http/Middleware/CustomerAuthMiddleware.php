<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CustomerAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();


        if (!$token || !cache()->has("customer_token:$token")) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->merge([
            'customer' => cache()->get("customer_token:$token")
        ]);

        return $next($request);
    }
}