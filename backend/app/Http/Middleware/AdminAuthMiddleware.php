<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();


        if (!$token || !cache()->has("admin_token:$token")) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->merge([
            'admin' => cache()->get("admin_token:$token")
        ]);

        return $next($request);
    }
}



