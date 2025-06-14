<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'expires_at',
        'owner_id',
        'max_uses',
        'is_global',
        'is_active',  
    ];

    protected $casts = [
        'expires_at'   => 'date',
        'discount_value' => 'decimal:2',
        'is_global'    => 'boolean',
        'is_active' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'coupon_id');
    }

    /**
     * Check if coupon can be applied to this package.
     * - Must belong to same owner
     * - Must not be expired or over max uses
     * - If is_global, applies to all owner's packages
     * - Otherwise, must be in pivot list
     */
    public function isValidFor(Package $package): bool
    {
        if ($this->owner_id !== $package->owner_id) {
            return false;
        }

        if ($this->expires_at && Carbon::today()->gt($this->expires_at)) {
            return false;
        }

        if ($this->max_uses !== null && $this->bookings()->count() >= $this->max_uses) {
            return false;
        }

        if (! $this->is_active) {
            return false;
        }
        
        if ($this->is_global) {
            return true;
        }


        return $this->packages()
                    ->where('package_id', $package->id)
                    ->exists();
    }

}
