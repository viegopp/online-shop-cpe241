<?php

namespace App\Http\Controllers\Admin\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOrderTracking extends Controller
{
    public function getOrderTracking(Request $request)
    {
        try {
            $page = max((int) $request->query('page', 1), 1);
            $perPage = 5;
            $offset = ($page - 1) * $perPage;

            $orders = DB::select("
                SELECT
                    o.order_id,
                    o.customer_id,
                    pm.method_name AS payment,
                    o.order_date,
                    pay.payment_date,
                    os.status_description AS order_status
                FROM orders AS o
                JOIN payments AS pay ON o.payment_id = pay.payment_id
                LEFT JOIN payment_methods AS pm ON pay.payment_method_id = pm.payment_method_id
                LEFT JOIN order_statuses AS os ON o.status_code = os.status_code
                ORDER BY o.order_date DESC
                LIMIT :limit OFFSET :offset
            ", [
                'limit' => $perPage,
                'offset' => $offset
            ]);

            return response()->json([
                'success' => true,
                'data' => $orders
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
