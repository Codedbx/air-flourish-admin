<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ActivityTimeSlot extends Model
{
     use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'activity_id',
        'starts_at',
        'ends_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    /**
     * Get the activity that owns the time slot.
     */
    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    /**
     * Get the booking slots for the time slot.
     */
    public function bookingSlots(): HasMany
    {
        return $this->hasMany(BookingSlot::class);
    }
}
