<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Models\InventoryLog;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = InventoryItem::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('low_stock') && $request->low_stock) {
            $query->whereRaw('stock <= low_stock_threshold');
        }

        $items = $query->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function show(InventoryItem $inventoryItem)
    {
        $inventoryItem->load('logs.user');

        return response()->json([
            'success' => true,
            'data' => $inventoryItem,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'stock' => 'required|numeric|min:0',
            'unit' => 'required|string',
            'low_stock_threshold' => 'required|numeric|min:0',
            'auto_deduct' => 'boolean',
        ]);

        $item = InventoryItem::create($validated);

        return response()->json([
            'success' => true,
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, InventoryItem $inventoryItem)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'unit' => 'sometimes|string',
            'low_stock_threshold' => 'sometimes|numeric|min:0',
            'auto_deduct' => 'boolean',
        ]);

        $inventoryItem->update($validated);

        return response()->json([
            'success' => true,
            'data' => $inventoryItem,
        ]);
    }

    public function adjustStock(Request $request, InventoryItem $inventoryItem)
    {
        $validated = $request->validate([
            'type' => 'required|in:addition,deduction,adjustment',
            'quantity' => 'required|numeric',
            'reason' => 'nullable|string',
        ]);

        $previousStock = $inventoryItem->stock;
        
        switch ($validated['type']) {
            case 'addition':
                $newStock = $previousStock + $validated['quantity'];
                break;
            case 'deduction':
                $newStock = $previousStock - $validated['quantity'];
                break;
            case 'adjustment':
                $newStock = $validated['quantity'];
                break;
        }

        $newStock = max(0, $newStock);

        $inventoryItem->update(['stock' => $newStock]);

        InventoryLog::create([
            'inventory_item_id' => $inventoryItem->id,
            'user_id' => auth()->id(),
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $validated['reason'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $inventoryItem,
            'message' => 'Stock adjusted successfully',
        ]);
    }

    public function lowStockAlerts()
    {
        $items = InventoryItem::whereRaw('stock <= low_stock_threshold')->get();

        return response()->json([
            'success' => true,
            'data' => $items,
            'count' => $items->count(),
        ]);
    }
}
