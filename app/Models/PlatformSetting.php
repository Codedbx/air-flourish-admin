<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Type\Decimal;

class PlatformSetting extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $fillable = [
        'admin_addon_type',
        'admin_addon_amount',
        'espees_rate',
        'naira_rate'
    ];
    
    protected $attributes = [
        'espees_rate' => 'decimal:2',
        'naira_rate' => 'decimal:2',
        'admin_addon_amount'=>'decimal:2',
    ];
}
