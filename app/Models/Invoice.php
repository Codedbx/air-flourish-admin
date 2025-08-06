<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Illuminate\Support\Facades\URL;


// class Invoice extends Model
// {
//       use HasFactory;

//     protected $fillable = [
//         'booking_id',
//         'invoice_number',
//         'file_path',
//         'status',
//         'download_count',
//         'last_downloaded_at',
//         'issued_at',
//     ];

//     protected $casts = [
//         'issued_at' => 'datetime',
//         'last_downloaded_at' => 'datetime',
//     ];

//     public function booking(): BelongsTo
//     {
//         return $this->belongsTo(Booking::class);
//     }

//     /**
//      * Generate a signed download URL that expires in 5 days
//      */
//     public function getSignedDownloadUrlAttribute(): string
//     {
//         return URL::temporarySignedRoute(
//             'invoices.download',
//             now()->addDays(5),
//             ['invoice' => $this->id]
//         );
//     }

//     /**
//      * Check if download limit has been reached
//      */
//     public function hasReachedDownloadLimit(): bool
//     {
//         return $this->download_count >= 5;
//     }

//     /**
//      * Increment download count and update status
//      */
//     public function recordDownload(): void
//     {
//         $this->increment('download_count');
//         $this->update([
//             'status' => 'downloaded',
//             'last_downloaded_at' => now(),
//         ]);
//     }


// }



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\URL;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'invoice_number',
        'file_path',
        'status',
        'download_count',
        'last_downloaded_at',
        'issued_at',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'last_downloaded_at' => 'datetime',
    ];

    // Define valid statuses
    public const STATUS_GENERATING = 'generating';
    public const STATUS_GENERATED = 'generated';
    public const STATUS_SENT = 'sent';
    public const STATUS_DOWNLOADED = 'downloaded';
    public const STATUS_FAILED = 'failed';

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Generate a signed download URL that expires in 5 days
     */
    public function getSignedDownloadUrlAttribute(): string
    {
        return URL::temporarySignedRoute(
            'invoices.download',
            now()->addDays(5),
            ['invoice' => $this->id]
        );
    }

    /**
     * Check if download limit has been reached
     */
    public function hasReachedDownloadLimit(): bool
    {
        return $this->download_count >= 5;
    }

    /**
     * Check if the PDF generation is still in progress
     */
    public function isGenerating(): bool
    {
        return $this->status === self::STATUS_GENERATING;
    }

    /**
     * Check if the PDF generation has failed
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Increment download count and update status
     */
    public function recordDownload(): void
    {
        $this->increment('download_count');
        $this->update([
            'status' => self::STATUS_DOWNLOADED,
            'last_downloaded_at' => now(),
        ]);
    }

    /**
     * Get estimated time remaining for PDF generation (in minutes)
     */
    public function getEstimatedGenerationTimeAttribute(): int
    {
        $timeSinceCreation = now()->diffInMinutes($this->created_at);
        
        // Typical generation time is 1-3 minutes
        $estimatedTotal = 3;
        $remaining = max(0, $estimatedTotal - $timeSinceCreation);
        
        return $remaining;
    }

    /**
     * Get human-readable status message
     */
    public function getStatusMessageAttribute(): string
    {
        return match($this->status) {
            self::STATUS_GENERATING => 'Your receipt is being prepared...',
            self::STATUS_GENERATED => 'Receipt is ready for download',
            self::STATUS_SENT => 'Receipt has been emailed and is ready for download',
            self::STATUS_DOWNLOADED => 'Receipt has been downloaded',
            self::STATUS_FAILED => 'Receipt generation failed - please contact support',
            default => 'Receipt status unknown',
        };
    }

    /**
     * Scope for invoices that are ready for download
     */
    public function scopeReady($query)
    {
        return $query->whereIn('status', [
            self::STATUS_GENERATED,
            self::STATUS_SENT,
            self::STATUS_DOWNLOADED
        ]);
    }

    /**
     * Scope for invoices that are still being generated
     */
    public function scopeGenerating($query)
    {
        return $query->where('status', self::STATUS_GENERATING);
    }

    /**
     * Scope for failed invoices
     */
    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }


    /**
     * Check if the PDF is ready for download
     */
    public function isReadyForDownload(): bool
    {
        // Must be in a completed status
        $validStatuses = [
            self::STATUS_GENERATED,
            self::STATUS_SENT,
            self::STATUS_DOWNLOADED
        ];
        
        if (!in_array($this->status, $validStatuses)) {
            return false;
        }
        
        // Must have a file path
        if (empty($this->file_path)) {
            return false;
        }
        
        // File must exist and be readable
        $fullPath = storage_path('app/' . $this->file_path);
        return file_exists($fullPath) && is_readable($fullPath);
    }

    /**
     * Get the full file path from relative path
     */
    public function getFullFilePathAttribute(): string
    {
        return storage_path('app/' . $this->file_path);
    }

    /**
     * Check if file actually exists on disk
     */
    public function fileExists(): bool
    {
        if (empty($this->file_path)) {
            return false;
        }
        
        $fullPath = storage_path('app/' . $this->file_path);
        return file_exists($fullPath) && is_readable($fullPath);
    }
}