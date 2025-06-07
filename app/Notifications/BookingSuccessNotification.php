<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
// use Illuminate\Notifications\Messages\BroadcastMessage;
// use Illuminate\Notifications\Messages\VonageMessage;
use Illuminate\Support\Carbon;

class BookingSuccessNotification extends Notification implements ShouldQueue
{
   use Queueable;

    protected $booking;
    protected $recipientName;
    protected $recipientEmail;
    protected $recipientPhone;

    public function __construct(
        Booking $booking,
        string $recipientName,
        string $recipientEmail,
        ?string $recipientPhone = null
    ) {
        $this->booking        = $booking;
        $this->recipientName  = $recipientName;
        $this->recipientEmail = $recipientEmail;
        $this->recipientPhone = $recipientPhone;
    }

    // public function via($notifiable): array
    // {
    //     $channels = ['mail'];

    //     if ($this->recipientPhone) {
    //         $channels[] = 'vonage';
    //     }

    //     if ($this->booking->user) {
    //         $channels[] = 'broadcast';
    //     }

    //     return $channels;
    // }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Booking Confirmed! Ref: {$this->booking->booking_reference}")
            ->markdown('emails.bookings.success', [
                'booking'       => $this->booking,
                'recipientName' => $this->recipientName,
            ]);
    }

    // public function toVonage($notifiable): VonageMessage
    // {
    //     $ref   = $this->booking->booking_reference;
    //     $title = $this->booking->package->title;
    //     $amt   = number_format($this->booking->total_price, 2);

    //     return (new VonageMessage())
    //         ->content("Hi {$this->recipientName}, your booking (Ref: {$ref}) for “{$title}” was successful. Total: \${$amt}.");
    // }

    // public function toBroadcast($notifiable): BroadcastMessage
    // {
    //     return new BroadcastMessage([
    //         'booking_id'        => $this->booking->id,
    //         'booking_reference' => $this->booking->booking_reference,
    //         'package_title'     => $this->booking->package->title,
    //         'total_price'       => $this->booking->total_price,
    //         'timestamp'         => Carbon::now()->toIso8601String(),
    //     ]);
    // }

    // public function toDatabase($notifiable): array
    // {
    //     return [
    //         'booking_id'        => $this->booking->id,
    //         'booking_reference' => $this->booking->booking_reference,
    //         'package_title'     => $this->booking->package->title,
    //         'total_price'       => $this->booking->total_price,
    //         'sent_at'           => now(),
    //     ];
    // }
}
