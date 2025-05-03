<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminAnalyticController;


use App\Http\Controllers\Customer\CustomerAuthController;


use App\Http\Controllers\LogoutController;
use App\Http\Controllers\DataController;

Route::get('/users', [DataController::class, 'getUsers']);
Route::get('/roles', [DataController::class, 'getRoles']);
Route::get('/admins', [DataController::class, 'getAdmins']);
Route::get('/customers', [DataController::class, 'getCustomers']);
Route::get('/manufacturers', [DataController::class, 'getManufacturers']);
Route::get('/categories', [DataController::class, 'getCategories']);
Route::get('/products', [DataController::class, 'getProducts']);
Route::get('/product-images', [DataController::class, 'getProductImages']);
Route::get('/cart-items', [DataController::class, 'getCartItems']);
Route::get('/order-statuses', [DataController::class, 'getOrderStatuses']);
Route::get('/payment-methods', [DataController::class, 'getPaymentMethods']);
Route::get('/payments', [DataController::class, 'getPayments']);
Route::get('/orders', [DataController::class, 'getOrders']);
Route::get('/order-items', [DataController::class, 'getOrderItems']);
Route::get('/reviews', [DataController::class, 'getReviews']);
Route::get('/promotions', [DataController::class, 'getPromotions']);
Route::get('/promotion-products', [DataController::class, 'getPromotionProducts']);
Route::get('/addresses', [DataController::class, 'getAddresses']);

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    
    Route::middleware('admin.auth')->group(function () {
        // Page only succesful login
        Route::post('logout', [LogoutController::class, 'AdminLogout']);
        
        Route::middleware('role:Super Admin')->group(function () {
            // Admin Home Page
            Route::get('dashboard', [AdminAnalyticController::class, 'getDashboardData']);
            Route::get('report', [AdminAnalyticController::class, 'getReportData']);
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