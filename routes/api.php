<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ToppingController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Toppings
    Route::get('/toppings', [ToppingController::class, 'index']);
    Route::post('/toppings', [ToppingController::class, 'store']);
    Route::put('/toppings/{topping}', [ToppingController::class, 'update']);
    Route::delete('/toppings/{topping}', [ToppingController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::get('/analytics', [OrderController::class, 'analytics']);
    Route::get('/admin/stats', [OrderController::class, 'stats']);

    // Inventory
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::get('/inventory/{inventoryItem}', [InventoryController::class, 'show']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::put('/inventory/{inventoryItem}', [InventoryController::class, 'update']);
    Route::post('/inventory/{inventoryItem}/adjust', [InventoryController::class, 'adjustStock']);
    Route::get('/inventory/alerts/low-stock', [InventoryController::class, 'lowStockAlerts']);
});
