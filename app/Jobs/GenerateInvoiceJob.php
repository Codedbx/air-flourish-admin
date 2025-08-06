<?php

namespace App\Jobs;

use App\Mail\BookingReceiptMail;
use App\Models\Booking;
use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateInvoiceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3; 
    public $timeout = 120; // 2 minutes timeout

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Booking $booking,
        public Invoice $invoice
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Refresh invoice data to get latest status
            $this->invoice->refresh();
            
            // Check if invoice is already processed
            if (in_array($this->invoice->status, ['generated', 'sent', 'downloaded'])) {
                Log::info('Invoice already processed, skipping job', [
                    'booking_id' => $this->booking->id,
                    'invoice_id' => $this->invoice->id,
                    'current_status' => $this->invoice->status
                ]);
                return;
            }
            
            // Check if file already exists
            if ($this->invoice->fileExists()) {
                Log::info('Invoice file already exists, updating status only', [
                    'booking_id' => $this->booking->id,
                    'invoice_id' => $this->invoice->id,
                    'file_path' => $this->invoice->file_path
                ]);
                
                // Update status and fire event
                if ($this->invoice->status === 'generating') {
                    $this->invoice->update(['status' => 'generated']);
                    
                    // Fire event to trigger invoice notifications
                    event(new \App\Events\BookingCreated($this->booking));
                }
                return;
            }

            Log::info('Starting invoice generation job', [
                'booking_id' => $this->booking->id,
                'invoice_id' => $this->invoice->id,
            ]);

            // Generate PDF
            $pdf = Pdf::loadView('invoices.receipt', ['booking' => $this->booking]);
            
            // Create storage directory if it doesn't exist
            $storageDir = storage_path('app/invoices');
            if (!file_exists($storageDir)) {
                mkdir($storageDir, 0755, true);
            }
            
            // Use relative path instead of full path
            $filename = $this->invoice->invoice_number . '.pdf';
            $relativePath = 'invoices/' . $filename;
            $fullPath = storage_path('app/' . $relativePath);
            
            $pdf->save($fullPath);

            // Verify file was actually created
            if (!file_exists($fullPath)) {
                throw new \Exception('PDF file was not created successfully');
            }

            // Store relative path in database
            $this->invoice->update([
                'file_path' => $relativePath,
                'status' => 'generated',
            ]);

            Log::info('PDF generated successfully', [
                'booking_id' => $this->booking->id,
                'invoice_id' => $this->invoice->id,
                'file_path' => $relativePath,
                'file_size' => filesize($fullPath)
            ]);

            // Fire event to trigger invoice receipt notification
            // The listener will check if invoice is ready and send notification
            event(new \App\Events\BookingCreated($this->booking));

            Log::info('Invoice generation completed and event fired', [
                'booking_id' => $this->booking->id,
                'invoice_id' => $this->invoice->id,
            ]);

        } catch (\Exception $e) {
            // Update invoice status to failed
            $this->invoice->update(['status' => 'failed']);
            
            Log::error('Invoice generation job failed', [
                'booking_id' => $this->booking->id,
                'invoice_id' => $this->invoice->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Re-throw exception to trigger job retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Invoice generation job failed permanently', [
            'booking_id' => $this->booking->id,
            'invoice_id' => $this->invoice->id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts(),
        ]);

        // Update invoice status to failed
        $this->invoice->update(['status' => 'failed']);
    }
}