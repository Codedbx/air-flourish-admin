<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageActivity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'package_id',
        'activity_id',
    ];


    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }
}
