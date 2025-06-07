<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'booking_id',
        'amount',
        'gateway',
        'transaction_reference',
        'status',
        'meta',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'meta'   => 'array',
        'status' => 'string',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
