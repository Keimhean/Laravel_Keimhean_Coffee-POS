<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'stock',
        'unit',
        'low_stock_threshold',
        'auto_deduct',
    ];

    protected $casts = [
        'stock' => 'decimal:2',
        'low_stock_threshold' => 'decimal:2',
        'auto_deduct' => 'boolean',
    ];

    public function logs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function isLowStock()
    {
        return $this->stock <= $this->low_stock_threshold;
    }
}
