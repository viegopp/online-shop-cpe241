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

            // Total Orders
            $totalOrders = DB::select("
                SELECT COUNT(*) AS total_orders
                FROM orders
                WHERE status_code != 1
            ");

            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_sales'       => $monthlySales,
                    'total_sales_amount'  => $totalSales[0]->total_sales_amount,
                    'total_customers'     => $totalCustomers[0]->total_customers,
                    'total_orders'        => $totalOrders[0]->total_orders
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error'   => $e->getMessage()
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
    
            // Top Selling Product per Category
            $topSellingPerCategory = DB::select("
                SELECT 
                    c.category_name,
                    p.product_id,
                    p.name AS product_name,
                    (
                        SELECT pi.image_path
                        FROM product_images pi
                        WHERE pi.product_id = p.product_id
                        ORDER BY pi.image_id ASC
                        LIMIT 1
                    ) AS image,
                    SUM(oi.quantity) AS total_sold
                FROM categories c
                JOIN products p ON c.category_id = p.category_id
                JOIN order_items oi ON p.product_id = oi.product_id
                JOIN orders o ON oi.order_id = o.order_id
                WHERE o.status_code != 1
                AND p.deleted_at IS NULL
                GROUP BY c.category_id, p.product_id
                HAVING total_sold = (
                    SELECT MAX(sub.total_qty)
                    FROM (
                        SELECT SUM(oi2.quantity) AS total_qty
                        FROM products p2
                        JOIN order_items oi2 ON p2.product_id = oi2.product_id
                        JOIN orders o2 ON oi2.order_id = o2.order_id
                        WHERE p2.category_id = c.category_id
                        AND o2.status_code != 1
                        AND p2.deleted_at IS NULL
                        GROUP BY p2.product_id
                    ) AS sub
                )
                ORDER BY c.category_name
            ");
    
            // Customers with Highest Order Count & Total Spent
            $topCustomers = DB::select("
                SELECT 
                    u.user_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
                    u.email,
                    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) AS total_orders,
                    (
                        SELECT SUM(p.total_amount)
                        FROM orders o
                        JOIN payments p ON o.payment_id = p.payment_id
                        WHERE o.customer_id = c.customer_id
                        AND o.status_code != 1
                    ) AS total_spent
                FROM customers c
                JOIN users u ON c.user_id = u.user_id
                ORDER BY total_orders DESC, total_spent DESC
                LIMIT 5
            ");
    
            // Revenue Loss from Discounted Promotions
            $promotionLoss = DB::select("
                SELECT 
                    pr.promotion_id,
                    pr.name,
                    pr.discount_percent,
                    COUNT(pp.product_id) AS total_products,
                    (
                        SELECT SUM(p.price * pr.discount_percent / 100)
                        FROM promotion_products pp2
                        JOIN products p ON pp2.product_id = p.product_id
                        WHERE pp2.promotion_id = pr.promotion_id
                        AND p.deleted_at IS NULL
                    ) AS estimated_discount_loss
                FROM promotions pr
                LEFT JOIN promotion_products pp ON pr.promotion_id = pp.promotion_id
                GROUP BY pr.promotion_id
                ORDER BY estimated_discount_loss DESC
                LIMIT 5
            ");
    
            // Review Summary per Product
            $reviewSummary = DB::select("
                SELECT 
                    p.product_id,
                    p.name,
                    COUNT(r.review_id) AS total_reviews,
                    ROUND(AVG(r.rating), 1) AS avg_rating,
                    (
                        SELECT COUNT(*)
                        FROM reviews r2
                        WHERE r2.product_id = p.product_id AND r2.rating = 5
                    ) AS five_star_count,
                    (
                        SELECT ROUND(100 * COUNT(*) / NULLIF(COUNT(*), 0), 1)
                        FROM reviews r3
                        WHERE r3.product_id = p.product_id AND r3.rating = 5
                    ) AS five_star_percentage
                FROM products p
                LEFT JOIN reviews r ON r.product_id = p.product_id
                WHERE p.deleted_at IS NULL
                GROUP BY p.product_id
                ORDER BY avg_rating DESC
                LIMIT 3
            ");
    
            return response()->json([
                'success' => true,
                'data' => [
                    'monthly_sales' => $monthlySales,
                    'product_performance' => $productPerformance,
                    'latest_reviews' => $latestReviews,
                    'category_sales' => $categorySales,
                    'top_selling_per_category' => $topSellingPerCategory,
                    'top_customers' => $topCustomers,
                    'promotion_loss' => $promotionLoss,
                    'review_summary' => $reviewSummary,
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