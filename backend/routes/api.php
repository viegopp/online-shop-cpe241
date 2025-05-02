<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Customer\CustomerAuthController;

use App\Http\Controllers\LogoutController;

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    
    Route::middleware('admin.auth')->group(function () {
        // Page only succesful login
        Route::post('logout', [LogoutController::class, 'AdminLogout']);

        
        Route::middleware('role:Super Admin')->group(function () {
            // Pages only for Super Admin
        });
    });
});

// Customer Routes
Route::prefix('customer')->group(function () {
    Route::post('register', [CustomerAuthController::class, 'register']);
    Route::post('login', [CustomerAuthController::class, 'login']);


    Route::middleware('customer.auth')->group(function () {
        // Page only succesful login
        Route::post('logout', [LogoutController::class, 'CustomerLogout']);
    });
});