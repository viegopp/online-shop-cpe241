<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RolePermission
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $token = $request->bearerToken();
        $admin = cache()->get("admin_token:$token");

        if (!$admin || !in_array($admin['role'], $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        return $next($request);
    }
}
