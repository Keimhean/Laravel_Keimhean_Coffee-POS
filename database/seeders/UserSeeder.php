<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@heencoffee.com',
            'password' => Hash::make('admin'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Cashier User',
            'email' => 'cashier@heencoffee.com',
            'password' => Hash::make('cashier'),
            'role' => 'cashier',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'john@heencoffee.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'is_active' => true,
        ]);
    }
}
