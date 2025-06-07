<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Package extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'description',
        'base_price',
        'total_activities_price',
        'total_price',
        'admin_addon_price',
        'admin_price_type',
        'agent_addon_price',
        'agent_price_type',
        'booking_start_date',
        'booking_end_date',
        'is_active',
        'is_featured',
        'is_refundable',
        'terms_and_conditions',
        'cancellation_policy',
        'location',
        'owner_id',
        'visibility',
      
        'flight_from',
        'flight_to',
        'airline_name',
        'booking_class',
        
        'hotel_name',
        'hotel_star_rating',
        'hotel_checkin',
        'hotel_checkout',
    ];


    protected $casts = [
        'base_price' => 'decimal:2',
        'total_activities_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'admin_addon_price' => 'decimal:2',
        'agent_addon_price' => 'decimal:2',
        'booking_start_date' => 'date',
        'booking_end_date'   => 'date',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'is_refundable' => 'boolean',

        'hotel_checkin' => 'datetime',
        'hotel_checkout' => 'datetime',
        'hotel_star_rating' => 'integer',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function activities(): BelongsToMany
    {
        return $this->belongsToMany(Activity::class, 'package_activities', 'package_id', 'activity_id');
    }


    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Media Handling
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('package_images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->withResponsiveImages();
            
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(200)
            ->sharpen(10);
    }

    // Computed Attributes
    public function getAgentTotalAttribute(): float
    {
        return $this->agent_price_type === 'fixed' 
            ? $this->base_price + $this->agent_addon_price
            : $this->base_price * (1 + $this->agent_addon_price / 100);
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('visibility', 'public')->where('is_active', true);
    }

    public function scopeSearchTitle($query, string $term)
    {
        return $query->where('title', 'LIKE', '%' . $term . '%');
    }

    public function scopeByDestination($query, string $destination)
    {
        return $query->where('location', 'like', "%{$destination}%");
    }

    public function scopeByPriceRange($query, float $min = null, float $max = null)
    {
        return $query->whereBetween('base_price', [$min ?? 0, $max ?? PHP_INT_MAX]);
    }

    public function scopeActiveBetween($query, $start, $end)
    {
        return $query->where('booking_start_date', '<=', $end)
            ->where('booking_end_date', '>=', $start);
    }

    public function scopeRandomFeatured($query)
    {
        return $query->where('is_featured', true)
                    ->inRandomOrder();
    }


    public function scopeFilterByActivityTitles($query, array $titles, string $match = 'any')
    {
        if ($match === 'all') {
            foreach ($titles as $t) {
                $query->whereHas('activities', fn($q) => 
                    $q->where('title', 'LIKE', "%{$t}%")
                );
            }
        } elseif ($match === 'none') {
            $query->whereDoesntHave('activities', fn($q) => 
                $q->whereIn('title', $titles) 
            );
        } else {
            $query->whereHas('activities', fn($q) => 
                $q->whereIn('title', $titles)
            );
        }

        return $query;
    }

}
