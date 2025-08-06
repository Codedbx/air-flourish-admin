<?php

namespace App\Listeners;

use App\Events\BookingCreated;
use App\Notifications\BookingSuccessNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendBookingNotification implements ShouldQueue
{
    use InteractsWithQueue;

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

        // Check if we should send the notification
        if ($this->shouldSendNotification($booking)) {
            $this->sendBookingNotification($booking);
        }
    }

    /**
     * Determine if we should send the notification
     */
    private function shouldSendNotification($booking): bool
    {
        $invoice = $booking->invoice;
        
        // If no invoice exists, don't send yet (PDF generation hasn't started)
        if (!$invoice) {
            Log::info('No invoice found, skipping notification', [
                'booking_id' => $booking->id
            ]);
            return false;
        }

        // Only send when invoice is ready (generated, sent, or downloaded)
        if (!in_array($invoice->status, ['generated', 'sent', 'downloaded'])) {
            Log::info('Invoice not ready, skipping notification', [
                'booking_id' => $booking->id,
                'invoice_status' => $invoice->status
            ]);
            return false;
        }

        // Check if we already sent this notification (prevent duplicates)
        $cacheKey = "booking_notification_sent_{$booking->id}";
        if (cache()->get($cacheKey)) {
            Log::info('Booking notification already sent, skipping', [
                'booking_id' => $booking->id
            ]);
            return false;
        }

        return true;
    }

    /**
     * Send booking success notification with receipt
     */
    private function sendBookingNotification($booking): void
    {
        try {
            if ($booking->user) {
                // Registered user: send via the User model
                $name = $booking->user->name;
                $email = $booking->user->email;
                $phone = $booking->user->phone ?? null;

                $booking->user->notify(
                    new BookingSuccessNotification($booking, $name, $email, $phone)
                );
            } else {
                // Guest: route mail to guest fields
                $guestName = trim($booking->guest_first_name . ' ' . $booking->guest_last_name);
                $guestEmail = $booking->guest_email;
                $guestPhone = $booking->guest_phone;

                Notification::route('mail', $guestEmail)
                    ->notify(
                        new BookingSuccessNotification(
                            $booking,
                            $guestName,
                            $guestEmail,
                            $guestPhone
                        )
                    );
            }

            // Mark as sent (cache for 24 hours)
            $cacheKey = "booking_notification_sent_{$booking->id}";
            cache()->put($cacheKey, true, 1440);

            // Update invoice status to 'sent'
            if ($booking->invoice) {
                $booking->invoice->update(['status' => 'sent']);
            }

            Log::info('Booking success notification sent with receipt', [
                'booking_id' => $booking->id,
                'invoice_id' => $booking->invoice?->id,
                'email' => $booking->user ? $booking->user->email : $booking->guest_email
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send booking success notification', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}