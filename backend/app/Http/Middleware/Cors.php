<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->getMethod() === "OPTIONS") {
            return response()->noContent(204)
                ->withHeaders([
                    'Access-Control-Allow-Origin'      => '*',
                    'Access-Control-Allow-Methods'     => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers'     => 'Content-Type, Authorization',
                    'Access-Control-Max-Age'           => '86400',
                ]);
        }

        $response = $next($request);

        return $response->withHeaders([
            'Access-Control-Allow-Origin'      => '*',
            'Access-Control-Allow-Methods'     => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers'     => 'Content-Type, Authorization',
        ]);
    }
}
