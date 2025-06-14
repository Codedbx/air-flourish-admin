<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view all bookings') || $user->can('view own bookings');
    }

    public function view(User $user, Booking $booking): bool
    {
        if ($user->can('view all bookings')) {
            return true;
        }

        return $user->can('view own bookings') &&
               $booking->package &&
               $booking->package->agent_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('create bookings');
    }

    public function update(User $user, Booking $booking): bool
    {
        if ($user->can('edit all bookings')) {
            return true;
        }

        return $user->can('edit own bookings') &&
               $booking->package &&
               $booking->package->agent_id === $user->id;
    }

    public function delete(User $user, Booking $booking): bool
    {
        if ($user->can('delete all bookings')) {
            return true;
        }

        return $user->can('delete own bookings') &&
               $booking->package &&
               $booking->package->agent_id === $user->id;
    }

    public function restore(User $user, Booking $booking): bool
    {
        return false;
    }

    public function forceDelete(User $user, Booking $booking): bool
    {
        return false;
    }
}
