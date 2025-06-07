<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $today = Carbon::today(); // current date at 00:00:00

        if ($today->lt($this->booking_start_date)) {
            // Before booking opens
            $state = 'Upcoming';
        } elseif ($today->gt($this->booking_end_date)) {
            // After booking closes
            $state = 'Closed';
        } else {
            // Within booking window
            $daysToEnd = $today->diffInDays($this->booking_end_date);
            if ($daysToEnd <= 7) {
                // Last 7 days before closing
                $state = "{$daysToEnd} days to closing";
            } else {
                // More than 7 days remaining
                $state = 'Open for booking';
            }
        }
         return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'base_price' => (float) $this->base_price, 
            'check_in_time' => $this->check_in_time,
            'check_out_time' => $this->check_out_time,
            'booking_start_date' => $this->booking_start_date,
            'booking_end_date' => $this->booking_end_date,
            'is_active' => (bool) $this->is_active,
            'is_featured' => (bool) $this->is_featured,
            'is_refundable' => (bool) $this->is_refundable,
            'terms_and_conditions' => $this->terms_and_conditions,
            'cancellation_policy' => $this->cancellation_policy,
            'location' => $this->location,
            'visibility' => $this->visibility,
            'package_state'  => $state,
            'owner' => $this->whenLoaded('owner', function () {
                return [
                    'id' => $this->owner->id,
                    'name' => $this->owner->name,
                    'email' => $this->owner->email,
                    'business_name' => $this->owner->business_name,
                    
                ];
            }),
            
            'activities_count' => $this->activities->count(),
            'media' => $this->whenLoaded('media', function () {
                return $this->media->map(function ($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->getUrl(),
                        'thumbnail_url' => $media->getUrl('thumb'), 
                        'name' => $media->file_name,
                        'size' => $media->size,
                        'mime_type' => $media->mime_type,
                    ];
                });
            }),
            'activities' => $this->whenLoaded('activities', function () {
                return ActivityResource::collection($this->activities);

               
                // return ActivityResource::collection(
                //     $this->activities->map(fn($pivotModel) => $pivotModel->activity)
                // );
            }),
        ];
    }
}
