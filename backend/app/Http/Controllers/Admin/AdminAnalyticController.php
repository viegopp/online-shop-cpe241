<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnalyticController extends Controller
{
    public function getDashboardData()
    {
        try {
            // Monthly Sales Summary
            $monthlySales = DB::select("
                SELECT
                    DATE_FORMAT(o.order_date, '%Y-%m') AS sale_month,
                    SUM(pay.total_amount) AS total_monthly_sale
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                JOIN order_items AS oi ON o.order_id = oi.order_id
                JOIN products AS p ON oi.product_id = p.product_id
                WHERE o.status_code != 1
                AND YEAR(o.order_date) = YEAR(CURDATE())
                GROUP BY sale_month
                ORDER BY sale_month
            ");

            // Total Sales Amount
            $totalSales = DB::select("
                SELECT SUM(pay.total_amount) AS total_sales_amount
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                WHERE o.status_code != 1
            ");

            // Total Customers
            $totalCustomers = DB::select("
                SELECT COUNT(DISTINCT customer_id) AS total_customers
                FROM customers
            ");

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_sales' => $monthlySales,
                    'total_sales_amount' => $totalSales[0]->total_sales_amount,
                    'total_customers' => $totalCustomers[0]->total_customers
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getReportData()
    {
        try {
            // Monthly Sales Summary
            $monthlySales = DB::select("
                SELECT
                    MONTH(o.order_date) AS sale_month,
                    SUM(pay.total_amount) AS total_monthly_sale
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                JOIN order_items AS oi ON o.order_id = oi.order_id
                JOIN products AS p ON oi.product_id = p.product_id
                WHERE o.status_code != 1
                GROUP BY sale_month
                ORDER BY sale_month
            ");

            // Product Performance
            $productPerformance = DB::select("
                SELECT 
                    p.name AS product_name,
                    SUM(oi.quantity) AS units_sold,
                    SUM(oi.quantity * p.price) AS revenue,
                    (SUM(oi.quantity * p.price) / (SELECT SUM(oi.quantity * p.price) 
                                                  FROM order_items AS oi 
                                                  JOIN products AS p ON oi.product_id = p.product_id)) * 100 AS percentage_of_total_sale
                FROM order_items AS oi
                JOIN products p ON oi.product_id = p.product_id
                GROUP BY p.product_id
                ORDER BY percentage_of_total_sale DESC
                LIMIT 5
            ");

            // Latest Reviews
            $latestReviews = DB::select("
                SELECT 
                    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
                    r.comment AS review_comment,
                    p.name AS product_name,
                    r.rating AS review_stats
                FROM reviews AS r
                JOIN products AS p ON r.product_id = p.product_id
                JOIN customers AS c ON r.customer_id = c.customer_id
                JOIN users AS u ON c.user_id = u.user_id
                ORDER BY r.created_at DESC
                LIMIT 3
            ");

            // Category Sales
            $categorySales = DB::select("
                SELECT 
                    c.category_name,
                    COUNT(DISTINCT o.order_id) AS total_orders,
                    SUM(oi.quantity * p.price) AS total_sales,
                    (SUM(oi.quantity * p.price) / (SELECT SUM(oi.quantity * p.price) 
                                                  FROM order_items oi 
                                                  JOIN products p ON oi.product_id = p.product_id)) * 100 AS percentage_of_total_sale
                FROM order_items oi
                JOIN products AS p ON oi.product_id = p.product_id
                JOIN categories AS c ON p.category_id = c.category_id
                JOIN orders AS o ON oi.order_id = o.order_id
                GROUP BY c.category_id
                ORDER BY percentage_of_total_sale DESC
            ");

            // Return all data
            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_sales' => $monthlySales,
                    'product_performance' => $productPerformance,
                    'latest_reviews' => $latestReviews,
                    'category_sales' => $categorySales,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
