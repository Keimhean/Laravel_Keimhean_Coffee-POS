<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Coffee Beans - Arabica', 'category' => 'Ingredients', 'stock' => 15.5, 'unit' => 'kg', 'low_stock_threshold' => 10, 'auto_deduct' => true],
            ['name' => 'Coffee Beans - Robusta', 'category' => 'Ingredients', 'stock' => 8.2, 'unit' => 'kg', 'low_stock_threshold' => 10, 'auto_deduct' => true],
            ['name' => 'Whole Milk', 'category' => 'Dairy', 'stock' => 25, 'unit' => 'L', 'low_stock_threshold' => 15, 'auto_deduct' => true],
            ['name' => 'Oat Milk', 'category' => 'Dairy', 'stock' => 12, 'unit' => 'L', 'low_stock_threshold' => 8, 'auto_deduct' => true],
            ['name' => 'Vanilla Syrup', 'category' => 'Syrups', 'stock' => 4, 'unit' => 'bottles', 'low_stock_threshold' => 5, 'auto_deduct' => true],
            ['name' => 'Caramel Syrup', 'category' => 'Syrups', 'stock' => 3, 'unit' => 'bottles', 'low_stock_threshold' => 5, 'auto_deduct' => true],
            ['name' => 'Paper Cups - 12oz', 'category' => 'Supplies', 'stock' => 450, 'unit' => 'pcs', 'low_stock_threshold' => 200, 'auto_deduct' => true],
            ['name' => 'Paper Cups - 16oz', 'category' => 'Supplies', 'stock' => 180, 'unit' => 'pcs', 'low_stock_threshold' => 200, 'auto_deduct' => true],
            ['name' => 'Lids', 'category' => 'Supplies', 'stock' => 520, 'unit' => 'pcs', 'low_stock_threshold' => 300, 'auto_deduct' => true],
            ['name' => 'Sugar', 'category' => 'Ingredients', 'stock' => 5.5, 'unit' => 'kg', 'low_stock_threshold' => 10, 'auto_deduct' => true],
        ];

        foreach ($items as $item) {
            InventoryItem::create($item);
        }
    }
}
