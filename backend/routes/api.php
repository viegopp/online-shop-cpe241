<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminAnalyticController;
use App\Http\Controllers\Admin\AdminInventoryController;


use App\Http\Controllers\Customer\CustomerAuthController;


use App\Http\Controllers\LogoutController;
use App\Http\Controllers\DataController;

Route::get('db/users', [DataController::class, 'getUsers']);
Route::get('db/roles', [DataController::class, 'getRoles']);
Route::get('db/admins', [DataController::class, 'getAdmins']);
Route::get('db/customers', [DataController::class, 'getCustomers']);
Route::get('db/manufacturers', [DataController::class, 'getManufacturers']);
Route::get('db/categories', [DataController::class, 'getCategories']);
Route::get('db/products', [DataController::class, 'getProducts']);
Route::get('db/product-images', [DataController::class, 'getProductImages']);
Route::get('db/cart-items', [DataController::class, 'getCartItems']);
Route::get('db/order-statuses', [DataController::class, 'getOrderStatuses']);
Route::get('db/payment-methods', [DataController::class, 'getPaymentMethods']);
Route::get('db/payments', [DataController::class, 'getPayments']);
Route::get('db/orders', [DataController::class, 'getOrders']);
Route::get('db/order-items', [DataController::class, 'getOrderItems']);
Route::get('db/reviews', [DataController::class, 'getReviews']);
Route::get('db/promotions', [DataController::class, 'getPromotions']);
Route::get('db/promotion-products', [DataController::class, 'getPromotionProducts']);
Route::get('db/addresses', [DataController::class, 'getAddresses']);



// Admin Routes
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);

    
    Route::middleware('admin.auth')->group(function () {
        // Page only succesful login
        Route::post('logout', [LogoutController::class, 'AdminLogout']);
        Route::get('inventory', [AdminInventoryController::class, 'getProductDetailBy']);
        Route::get('inventory/{product_id}', [AdminInventoryController::class, 'getProductDetailByID']);
        Route::post('inventory', [AdminInventoryController::class, 'createProduct']);
        Route::patch('inventory/{product_id}', [AdminInventoryController::class, 'updateProductDetailByID']);
        Route::delete('inventory/{product_id}', [AdminInventoryController::class, 'deleteProductByID']);
        
        
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