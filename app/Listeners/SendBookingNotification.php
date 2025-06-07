<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Notifications\BookingSuccessNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendBookingNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BookingCreated $event): void
    {
         $booking = $event->booking;

        if ($booking->user) {
            // Registered user: send via the User model
            $name  = $booking->user->name;
            $email = $booking->user->email;
            $phone = $booking->user->phone ?? null;

            $booking->user->notify(
                new BookingSuccessNotification($booking, $name, $email, $phone)
            );
        } else {
            // Guest: route mail and SMS to guest fields
            $guestName  = trim($booking->guest_first_name . ' ' . $booking->guest_last_name);
            $guestEmail = $booking->guest_email;
            $guestPhone = $booking->guest_phone;

            Notification::route('mail',   $guestEmail)
                        ->notify(
                            new BookingSuccessNotification(
                                $booking,
                                $guestName,
                                $guestEmail,
                                $guestPhone
                            )
                        );
        }
    }
}
