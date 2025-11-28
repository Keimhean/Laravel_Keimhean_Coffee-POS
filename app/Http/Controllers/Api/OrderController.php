<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $query->where('order_number', 'like', '%' . $request->search . '%');
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'order_type' => 'required|in:delivery,dine-in,take-away',
            'payment_method' => 'required|in:cash,card,qr,split',
            'discount_type' => 'nullable|in:percentage,amount',
            'discount_value' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.size' => 'required|in:Small,Large',
            'items.*.temperature' => 'nullable|in:Hot,Cold',
            'items.*.toppings' => 'nullable|array',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                $itemPrice = $product->price;
                
                if ($item['size'] === 'Large') {
                    $itemPrice *= 1.3;
                }
                
                if (isset($item['toppings']) && !empty($item['toppings'])) {
                    $toppingIds = array_column($item['toppings'], 'id');
                    $toppings = \App\Models\Topping::whereIn('id', $toppingIds)->get();
                    $itemPrice += $toppings->sum('price');
                }
                
                $subtotal += $itemPrice * $item['quantity'];
            }

            // Calculate discount
            $discountAmount = 0;
            if (isset($validated['discount_type']) && isset($validated['discount_value'])) {
                if ($validated['discount_type'] === 'percentage') {
                    $discountAmount = ($subtotal * $validated['discount_value']) / 100;
                } else {
                    $discountAmount = $validated['discount_value'];
                }
            }

            $total = $subtotal - $discountAmount;

            // Create order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $validated['user_id'],
                'order_type' => $validated['order_type'],
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'discount_type' => $validated['discount_type'] ?? null,
                'discount_value' => $validated['discount_value'] ?? null,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'note' => $validated['note'] ?? null,
                'completed_at' => now(),
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                $itemPrice = $product->price;
                
                if ($item['size'] === 'Large') {
                    $itemPrice *= 1.3;
                }
                
                $toppingNames = [];
                if (isset($item['toppings']) && !empty($item['toppings'])) {
                    $toppingIds = array_column($item['toppings'], 'id');
                    $toppings = \App\Models\Topping::whereIn('id', $toppingIds)->get();
                    $itemPrice += $toppings->sum('price');
                    $toppingNames = $toppings->pluck('name')->toArray();
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_price' => $itemPrice,
                    'size' => $item['size'],
                    'temperature' => $item['temperature'] ?? null,
                    'toppings' => $toppingNames,
                    'quantity' => $item['quantity'],
                    'total_price' => $itemPrice * $item['quantity'],
                ]);
            }

            DB::commit();

            $order->load(['items', 'user']);

            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order created successfully',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled,refunded',
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order status updated successfully',
        ]);
    }

    public function analytics(Request $request)
    {
        $dateFrom = $request->input('date_from', now()->subDays(7));
        $dateTo = $request->input('date_to', now());

        $totalOrders = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->where('status', 'completed')
            ->count();

        $totalRevenue = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->where('status', 'completed')
            ->sum('total');

        $averageOrder = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(total_price) as revenue'))
            ->whereHas('order', function($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('created_at', [$dateFrom, $dateTo])
                      ->where('status', 'completed');
            })
            ->groupBy('product_name')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'average_order' => $averageOrder,
                'top_products' => $topProducts,
            ],
        ]);
    }

    public function stats()
    {
        $totalRevenue = Order::where('status', 'completed')->sum('total');
        $totalOrders = Order::count();
        $ordersToday = Order::whereDate('created_at', today())->count();
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Sales trend (last 7 days)
        $salesTrend = Order::where('status', 'completed')
            ->whereBetween('created_at', [now()->subDays(7), now()])
            ->selectRaw('DATE(created_at) as date, SUM(total) as sales')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => date('M d', strtotime($item->date)),
                    'sales' => (float) $item->sales
                ];
            });

        // Top products
        $topProducts = OrderItem::select('product_name as name', DB::raw('SUM(total_price) as sales'))
            ->groupBy('product_name')
            ->orderBy('sales', 'desc')
            ->limit(5)
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->name,
                    'sales' => (float) $item->sales
                ];
            });

        // Recent orders
        $recentOrders = Order::with(['user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->user->name ?? 'Guest',
                    'created_at' => $order->created_at,
                    'total' => $order->total,
                    'status' => $order->status
                ];
            });

        return response()->json([
            'total_revenue' => (float) $totalRevenue,
            'revenue_growth' => 12.5,
            'total_orders' => $totalOrders,
            'orders_today' => $ordersToday,
            'total_products' => \App\Models\Product::count(),
            'active_products' => \App\Models\Product::count(),
            'avg_order_value' => (float) $avgOrderValue,
            'aov_growth' => 8.3,
            'sales_trend' => $salesTrend,
            'top_products' => $topProducts,
            'recent_orders' => $recentOrders
        ]);
    }
}
