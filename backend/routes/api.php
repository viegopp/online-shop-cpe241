<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Cors;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminAnalyticController;
use App\Http\Controllers\Admin\AdminInventoryController;
use App\Http\Controllers\Admin\AdminReviewsContrlloer;

use App\Http\Controllers\Customer\CustomerAuthController;

use App\Http\Controllers\LogoutController;
use App\Http\Controllers\DataController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are automatically prefixed with "/api" and are all wrapped
| in our custom CORS middleware to allow cross-origin requests.
|
*/

Route::middleware([ Cors::class ])->group(function () {

    // --- DataController (db/*) routes ---
    Route::get('db/users',              [DataController::class, 'getUsers']);
    Route::get('db/roles',              [DataController::class, 'getRoles']);
    Route::get('db/admins',             [DataController::class, 'getAdmins']);
    Route::get('db/customers',          [DataController::class, 'getCustomers']);
    Route::get('db/manufacturers',      [DataController::class, 'getManufacturers']);
    Route::get('db/categories',         [DataController::class, 'getCategories']);
    Route::get('db/products',           [DataController::class, 'getProducts']);
    Route::get('db/product-images',     [DataController::class, 'getProductImages']);
    Route::get('db/cart-items',         [DataController::class, 'getCartItems']);
    Route::get('db/order-statuses',     [DataController::class, 'getOrderStatuses']);
    Route::get('db/payment-methods',    [DataController::class, 'getPaymentMethods']);
    Route::get('db/payments',           [DataController::class, 'getPayments']);
    Route::get('db/orders',             [DataController::class, 'getOrders']);
    Route::get('db/order-items',        [DataController::class, 'getOrderItems']);
    Route::get('db/reviews',            [DataController::class, 'getReviews']);
    Route::get('db/promotions',         [DataController::class, 'getPromotions']);
    Route::get('db/promotion-products', [DataController::class, 'getPromotionProducts']);
    Route::get('db/addresses',          [DataController::class, 'getAddresses']);

    // --- Admin Routes ---
    Route::prefix('admin')->group(function () {
        // login is publicly accessible
        Route::post('login', [AdminAuthController::class, 'login']);

        // protected admin routes
        Route::middleware('admin.auth')->group(function () {
            Route::get('inventory',               [AdminInventoryController::class, 'getProductDetailBy']);
            Route::get('inventory/{product_id}',  [AdminInventoryController::class, 'getProductDetailByID']);
            Route::post('inventory',              [AdminInventoryController::class, 'createProduct']);
            Route::patch('inventory/{product_id}',[AdminInventoryController::class, 'updateProductDetailByID']);
            Route::delete('inventory/{product_id}',[AdminInventoryController::class, 'deleteProductByID']);

            Route::get('review',                  [AdminReviewsContrlloer::class, 'getProductCardBy']);
            Route::get('review/{product_id}',     [AdminReviewsContrlloer::class, 'getProductReviewByID']);
            Route::put('review/{review_id}',      [AdminReviewsContrlloer::class, 'replyComment']);

            Route::post('logout',                 [LogoutController::class, 'AdminLogout']);

            // Super Admin only
            Route::middleware('role:Super Admin')->group(function () {
                Route::get('dashboard', [AdminAnalyticController::class, 'getDashboardData']);
                Route::get('report',    [AdminAnalyticController::class, 'getReportData']);
            });
        });
    });

    // --- Customer Routes ---
    Route::prefix('customer')->group(function () {
        Route::post('register', [CustomerAuthController::class, 'register']);
        Route::post('login',    [CustomerAuthController::class, 'login']);

        Route::middleware('customer.auth')->group(function () {
            Route::post('logout', [LogoutController::class, 'CustomerLogout']);
        });
    });
});
