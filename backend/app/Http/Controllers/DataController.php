<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Exception;

class DataController extends Controller
{
    public function getUsers(): JsonResponse
    {
        return $this->fetchData('users');
    }

    public function getRoles(): JsonResponse
    {
        return $this->fetchData('roles');
    }

    public function getAdmins(): JsonResponse
    {
        return $this->fetchData('admins');
    }

    public function getCustomers(): JsonResponse
    {
        return $this->fetchData('customers');
    }

    public function getManufacturers(): JsonResponse
    {
        return $this->fetchData('manufacturers');
    }

    public function getCategories(): JsonResponse
    {
        return $this->fetchData('categories');
    }

    public function getProducts(): JsonResponse
    {
        return $this->fetchData('products');
    }

    public function getProductImages(): JsonResponse
    {
        return $this->fetchData('product_images');
    }

    public function getCartItems(): JsonResponse
    {
        return $this->fetchData('cart_items');
    }

    public function getOrderStatuses(): JsonResponse
    {
        return $this->fetchData('order_statuses');
    }

    public function getPaymentMethods(): JsonResponse
    {
        return $this->fetchData('payment_methods');
    }

    public function getPayments(): JsonResponse
    {
        return $this->fetchData('payments');
    }

    public function getOrders(): JsonResponse
    {
        return $this->fetchData('orders');
    }

    public function getOrderItems(): JsonResponse
    {
        return $this->fetchData('order_items');
    }

    public function getReviews(): JsonResponse
    {
        return $this->fetchData('reviews');
    }

    public function getPromotions(): JsonResponse
    {
        return $this->fetchData('promotions');
    }

    public function getPromotionProducts(): JsonResponse
    {
        return $this->fetchData('promotion_products');
    }

    public function getAddresses(): JsonResponse
    {
        return $this->fetchData('addresses');
    }

    private function fetchData(string $table): JsonResponse
    {
        try {
            $data = DB::table($table)->get();
            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'error' => "Failed to retrieve data from table [$table].",
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
