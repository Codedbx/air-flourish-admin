<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'reference'    => $this->booking_reference,
            'user'         => [
                'id'    => $this->user?->id,
                'name'  => $this->user?->name ?? $this->guest_full_name,
                'email' => $this->user?->email ?? $this->guest_email,
            ],
            'package'      => [
                'id'    => $this->package->id,
                'title' => $this->package->title,
                'owner' => [
                    'id'   => $this->package->owner?->id,
                    'name' => $this->package->owner?->name,
                ],
            ],
            'total_amount' => (float) $this->total_price,
            'status'       => ucfirst($this->status),
            'booked_at'    => $this->created_at->format('F j, Y, g:i a'),
            'flight'       => [
                'from'    => strtoupper($this->package->flight_from),
                'to'      => strtoupper($this->package->flight_to),
                'airline' => $this->package->airline_name,
                'class'   => ucfirst($this->package->booking_class),
            ],
            'hotel'        => [
                'name'        => $this->package->hotel_name,
                'star_rating' => $this->package->hotel_star_rating,
                'checkin'     => $this->package->hotel_checkin->format('F j, Y'),
                'checkout'    => $this->package->hotel_checkout->format('F j, Y'),
            ],
        ];
    }
}
