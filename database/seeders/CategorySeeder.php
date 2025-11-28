<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Coffee', 'slug' => 'coffee', 'description' => 'Hot and cold coffee beverages', 'sort_order' => 1],
            ['name' => 'Non Coffee', 'slug' => 'non-coffee', 'description' => 'Tea and other non-coffee drinks', 'sort_order' => 2],
            ['name' => 'Food', 'slug' => 'food', 'description' => 'Breakfast and lunch items', 'sort_order' => 3],
            ['name' => 'Snack', 'slug' => 'snack', 'description' => 'Light snacks and pastries', 'sort_order' => 4],
            ['name' => 'Dessert', 'slug' => 'dessert', 'description' => 'Sweet treats and desserts', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
