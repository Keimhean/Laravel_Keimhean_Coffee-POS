<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Topping;

class ToppingSeeder extends Seeder
{
    public function run(): void
    {
        $toppings = [
            ['name' => 'Extra Shot', 'price' => 1.00],
            ['name' => 'Vanilla Syrup', 'price' => 0.50],
            ['name' => 'Caramel', 'price' => 0.50],
            ['name' => 'Chocolate', 'price' => 0.50],
            ['name' => 'Oat Milk', 'price' => 0.75],
            ['name' => 'Almond Milk', 'price' => 0.75],
            ['name' => 'Whipped Cream', 'price' => 0.50],
        ];

        foreach ($toppings as $topping) {
            Topping::create($topping);
        }
    }
}
