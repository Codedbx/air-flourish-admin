<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
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
        $this->booking = $booking;
        $this->recipientName = $recipientName;
        $this->recipientEmail = $recipientEmail;
        $this->recipientPhone = $recipientPhone;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $invoice = $this->booking->invoice;
        
        $mailMessage = (new MailMessage)
            ->subject("Booking Confirmed! Ref: {$this->booking->booking_reference}")
            ->view('emails.bookings.booking-receipt', [
                'booking' => $this->booking,
                'invoice' => $invoice,
                'recipientName' => $this->recipientName,
                'downloadUrl' => $invoice?->signed_download_url,
            ]);

        // Attach PDF if invoice exists and file is ready
        if ($invoice && $invoice->fileExists()) {
            $filePath = storage_path('app/' . $invoice->file_path);
            $fileName = 'Receipt_' . $this->booking->booking_reference . '.pdf';
            
            $mailMessage->attach($filePath, [
                'as' => $fileName,
                'mime' => 'application/pdf',
            ]);
        }

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_reference' => $this->booking->booking_reference,
            'recipient_name' => $this->recipientName,
            'recipient_email' => $this->recipientEmail,
            'sent_at' => Carbon::now()->toIso8601String(),
        ];
    }

    /**
     * Prevent duplicate notifications
     */
    public function uniqueId(): string
    {
        return "booking_success_{$this->booking->id}";
    }
}