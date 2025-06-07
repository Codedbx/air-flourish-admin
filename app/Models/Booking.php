<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'booking_reference', 
        'user_id',
        'guest_first_name',
        'guest_last_name',
        'guest_email',
        'guest_phone',
        'guest_country',
        'guest_city',
        'guest_zip_code',
        'guest_gender',
        'package_id',
        'pax_count',
        'base_price',
        'activities_total',
        'computed_agent_addon',
        'computed_admin_addon',
        'total_price_per_person',
        'total_price',
        'status',
        'access_token',
        'access_token_expires_at',
        'snapshot',
    ];

    protected $casts = [
        'pax_count'                => 'integer',
        'base_price'               => 'decimal:2',
        'activities_total'         => 'decimal:2',
        'computed_agent_addon'     => 'decimal:2',
        'computed_admin_addon'     => 'decimal:2',
        'total_price_per_person'   => 'decimal:2',
        'total_price'              => 'decimal:2',
        'status'                   => 'string',
        'access_token_expires_at'  => 'datetime',
        'snapshot'                 => 'array',
    ];

    // Auto-generate booking_reference on creating
    protected static function booted()
    {
        static::creating(function ($booking) {
            $booking->booking_reference = Str::upper(Str::random(10));
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
