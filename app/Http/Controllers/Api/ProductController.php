<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'toppings'])
            ->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'toppings']);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'has_temperature' => 'boolean',
            'has_size' => 'boolean',
            'topping_ids' => 'nullable|array',
            'topping_ids.*' => 'exists:toppings,id',
        ]);

        $validated['slug'] = \Str::slug($validated['name']);

        $product = Product::create($validated);

        if (isset($validated['topping_ids'])) {
            $product->toppings()->attach($validated['topping_ids']);
        }

        $product->load(['category', 'toppings']);

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'image' => 'nullable|string',
            'has_temperature' => 'boolean',
            'has_size' => 'boolean',
            'is_active' => 'boolean',
            'topping_ids' => 'nullable|array',
            'topping_ids.*' => 'exists:toppings,id',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        $product->update($validated);

        if (isset($validated['topping_ids'])) {
            $product->toppings()->sync($validated['topping_ids']);
        }

        $product->load(['category', 'toppings']);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }
}
