<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*') // Allow all origins (you can change '*' to a specific domain)
            ->header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE') // Allowed HTTP methods
            ->header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Authorization, Origin, Accept, X-Requested-With') // Allowed request headers
            ->header('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, authorization headers, etc.)
    }
}
