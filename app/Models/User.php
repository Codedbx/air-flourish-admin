<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */

    use HasApiTokens, HasFactory, Notifiable, HasRoles, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'business_name',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'email_verified_at',
        'email',
        'cac_reg_no',
        'active',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'active'            => 'boolean',
    ];

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class, 'owner_id');
    }


    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, 'agent_id');
    }


    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('email', 'LIKE', "%{$term}%")
              ->orWhere('business_name', 'LIKE', "%{$term}%");
        });
    }

    public function scopeByRole(Builder $query, ?string $role): Builder
    {
        if (! $role || $role === 'all') {
            return $query;
        }

        return $query->whereHas('roles', function (Builder $q) use ($role) {
            $q->where('name', $role);
        });
    }

    public function scopeByStatus(Builder $query, ?string $status): Builder
    {
        if ($status === 'active') {
            return $query->where('active', true);
        }

        if ($status === 'inactive') {
            return $query->where('active', false);
        }

        return $query;
    }

    public function scopeOrdered(Builder $query, ?string $sortBy, ?string $sortOrder): Builder
    {
        $allowed = ['name', 'email', 'business_name',  'created_at'];

        $column = in_array($sortBy, $allowed, true) ? $sortBy : 'name';
        $dir    = ($sortOrder === 'desc') ? 'desc' : 'asc';

        return $query->orderBy($column, $dir);
    }

}
