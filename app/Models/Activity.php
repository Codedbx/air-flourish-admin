<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Activity extends Model
{
    /** @use HasFactory<\Database\Factories\ActivityFactory> */
   use HasFactory;

    protected $fillable = [
        'agent_id',
        'title',
        'location',
        'price',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'price' => 'decimal:2',
    ];

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_activities', 'activity_id', 'package_id');
    }


    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function timeSlots(): HasMany
    {
        return $this->hasMany(ActivityTimeSlot::class, 'activity_id');
    }

}
