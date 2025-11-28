<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topping;
use Illuminate\Http\Request;

class ToppingController extends Controller
{
    public function index()
    {
        $toppings = Topping::where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => $toppings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $topping = Topping::create($validated);

        return response()->json([
            'success' => true,
            'data' => $topping,
        ], 201);
    }

    public function update(Request $request, Topping $topping)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $topping->update($validated);

        return response()->json([
            'success' => true,
            'data' => $topping,
        ]);
    }

    public function destroy(Topping $topping)
    {
        $topping->delete();

        return response()->json([
            'success' => true,
            'message' => 'Topping deleted successfully',
        ]);
    }
}
