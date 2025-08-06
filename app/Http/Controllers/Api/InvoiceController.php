<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class InvoiceController extends Controller
{
    /**
     * Download invoice/receipt with signed URL verification
     */
    public function download(Request $request, Invoice $invoice)
    {
        // Rate limiting per IP (10 attempts per minute)
        if (!RateLimiter::attempt('invoice-download:' . $request->ip(), 10, function() {}, 60)) {
            abort(429, 'Too many download attempts. Please try again later.');
        }

        // Check if download limit has been reached
        if ($invoice->hasReachedDownloadLimit()) {
            abort(403, 'Download limit exceeded. Maximum 5 downloads allowed per receipt.');
        }

        // Check if PDF is still being generated
        if ($invoice->isGenerating()) {
            return response()->json([
                'status' => 'generating',
                'message' => 'Your receipt is still being prepared. Please try again in a few minutes.',
                'data' => [
                    'estimated_time_remaining' => $invoice->estimated_generation_time,
                    'status_message' => $invoice->status_message,
                    'retry_after' => 60, // seconds
                ]
            ], 202); // 202 Accepted - processing
        }

        // Check if PDF generation failed
        if ($invoice->hasFailed()) {
            return response()->json([
                'status' => 'failed',
                'message' => 'Receipt generation failed. Please contact support for assistance.',
                'data' => [
                    'booking_reference' => $invoice->booking->booking_reference,
                    'support_contact' => config('app.support_email', 'support@example.com'),
                ]
            ], 422); // 422 Unprocessable Entity
        }

        // Get the full file path
        $fullPath = storage_path('app/' . $invoice->file_path);
        
        // Verify the file exists
        if (empty($invoice->file_path) || !file_exists($fullPath)) {
            Log::error('Invoice file not found', [
                'invoice_id' => $invoice->id,
                'file_path' => $invoice->file_path,
                'full_path' => $fullPath,
                'status' => $invoice->status,
                'file_exists' => file_exists($fullPath),
                'storage_path' => storage_path('app/'),
                'dir_contents' => is_dir(storage_path('app/invoices/')) ? scandir(storage_path('app/invoices/')) : 'Directory not found'
            ]);
            
            return response()->json([
                'status' => 'not_ready',
                'message' => 'Receipt file not found. Please try again shortly or check your email.',
                'data' => [
                    'status_message' => $invoice->status_message,
                    'booking_reference' => $invoice->booking->booking_reference,
                ]
            ], 422);
        }

        // Verify file is readable
        if (!is_readable($fullPath)) {
            Log::error('Invoice file not readable', [
                'invoice_id' => $invoice->id,
                'file_path' => $fullPath,
                'permissions' => substr(sprintf('%o', fileperms($fullPath)), -4)
            ]);
            
            return response()->json([
                'status' => 'not_ready',
                'message' => 'Receipt file is not accessible. Please contact support.',
                'data' => [
                    'booking_reference' => $invoice->booking->booking_reference,
                ]
            ], 422);
        }

        // Log download attempt
        Log::info('Invoice downloaded', [
            'invoice_id' => $invoice->id,
            'booking_reference' => $invoice->booking->booking_reference,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'download_count' => $invoice->download_count + 1,
            'file_path' => $fullPath,
            'file_size' => filesize($fullPath)
        ]);

        // Record the download
        $invoice->recordDownload();

        // Generate filename for download
        $filename = 'Receipt_' . $invoice->booking->booking_reference . '.pdf';

        return response()->download($fullPath, $filename, [
            'Content-Type' => 'application/pdf',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0'
        ]);
    }

    /**
     * Get invoice details (for frontend to check status, download count, etc.)
     */
    public function show(Invoice $invoice)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'invoice_number' => $invoice->invoice_number,
                'status' => $invoice->status,
                'download_count' => $invoice->download_count,
                'downloads_remaining' => max(0, 5 - $invoice->download_count),
                'last_downloaded_at' => $invoice->last_downloaded_at,
                'issued_at' => $invoice->issued_at,
                'download_url' => $invoice->signed_download_url,
                'booking_reference' => $invoice->booking->booking_reference,
            ]
        ]);
    }
}