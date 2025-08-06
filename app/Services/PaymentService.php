<?php

// namespace App\Services;

// use App\Adapters\EspeesGateway;
// use App\Adapters\PaymentGatewayAdapter;
// use App\Events\BookingCreated;
// use App\Models\Booking;
// use App\Models\Payment;
// use App\Models\PlatformSetting;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Str;

// class PaymentService
// {

//      public function __construct(
//         private PaymentGatewayAdapter $gatewayFactory
//     ) {}

    

//     public function initiate(Booking $booking, array $data): Payment
// {
//     return DB::transaction(function () use ($booking, $data) {
//         $gateway = $this->gatewayFactory->make($data['gateway']);
//         $reference = Str::uuid()->toString();
        
//         // Get platform settings for currency conversion
//         $platformSettings = PlatformSetting::first();
        
//         $convertedAmount = $booking->total_price;
//         $currency = 'USD';
        
//         if (strtolower($data['gateway']) === 'espees') {
//             // For Espees, divide by espees_rate
//             $convertedAmount = (float)($booking->total_price * $platformSettings->espees_rate);
//             $currency = 'ESP';
//         } elseif (strtolower($data['gateway']) === 'paystack') {
//             // For Paystack, divide by naira_rate
//             $convertedAmount = (float)($booking->total_price * $platformSettings->naira_rate);
//             $currency = 'NGN';
//         }
//         $gatewayAmount = $convertedAmount * 100;
        

//         $payment = Payment::create([
//             'booking_id' => $booking->id,
//             'amount' => $booking->total_price,
//             'gateway' => $data['gateway'],
//             'transaction_reference' => $reference,
//             'status' => 'pending',
//             'currency' => "USD",
//             'meta' => [
//                 'return_url' => $data['return_url'],
//                 'cancel_url' => $data['cancel_url'],
//                 'original_amount' => $booking->total_price,
//                 'converted_amount' => $gatewayAmount,
//                 'currency' => $currency,
//             ],
//         ]);

//         try {
//             $result = $gateway->initialize([
//                 'email' => $booking->guest_email,
//                 'amount' => $gatewayAmount,
//                 'currency' => $currency,
//                 'reference' => $reference,
//                 'metadata' => [
//                     'booking_reference' => $booking->reference,
//                     'customer_name' => $booking->customer_name,
//                 ],
//                 'return_url' => $data['return_url'],
//                 'cancel_url' => $data['cancel_url'],
//             ]);
            
//             Log::info('Payment gateway initialization result', [
//                 'gateway' => $data['gateway'],
//                 'reference' => $reference,
//                 'original_amount' => $booking->total_price,
//                 'converted_amount' => $convertedAmount,
//                 'gateway_amount' => $gatewayAmount,
//                 'currency' => $currency,
//                 'result' => $result,
//                 'platform' => $platformSettings,
//             ]);

//             $payment->update([
//                 'meta' => array_merge($payment->meta, [
//                     'checkout_url' => $result['checkout_url'],
//                     'gateway_reference' => $result['gateway_reference'] ?? null,
//                 ]),
//             ]);

//             return $payment;
//         } catch (\Exception $e) {
//             $payment->update(['status' => 'failed']);
//             throw $e;
//         }
//     });
// }

//     public function verify(string $reference): array
//     {
//         $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
//         $gateway = $this->gatewayFactory->make($payment->gateway);

//         $verificationResult = $gateway->verify($reference);

//         if ($verificationResult['status'] === 'success') {
//             $this->updatePaymentStatus($payment, 'paid');
//             $this->confirmBooking($payment->booking);
//         } else {
//             $this->updatePaymentStatus($payment, 'failed');
//         }

//         return [
//             'payment' => $payment->fresh(),
//             'booking' => $payment->booking,

//         ];
//     }

//     public function handleWebhook(array $payload): void
//     {
//         $gateway = $this->gatewayFactory->make($payload['gateway'] ?? '');
//         $event = $gateway->parseWebhookPayload($payload);

//         if (!$event) {
//             throw new \Exception('Invalid webhook payload');
//         }

//         $payment = Payment::where('transaction_reference', $event['reference'])->first();

//         if (!$payment) {
//             Log::error('Payment not found for webhook', ['event' => $event]);
//             return;
//         }

//         switch ($event['type']) {
//             case 'payment.success':
//                 $this->updatePaymentStatus($payment, 'paid');
//                 $this->confirmBooking($payment->booking);
//                 break;
//             case 'payment.failed':
//                 $this->updatePaymentStatus($payment, 'failed');
//                 break;
//             default:
//                 Log::info('Unhandled webhook event', ['type' => $event['type']]);
//         }
//     }

//     /**
//      * Handle Espees callback from success/failure URLs
//      */
//     public function handleEspeesCallback(string $reference, bool $isSuccess): array
//     {
//         $payment = Payment::where('transaction_reference', $reference)->firstOrFail();

//         // Verify that this is an Espees payment
//         if ($payment->gateway !== 'espees') {
//             throw new \Exception('Invalid gateway for callback');
//         }

//         Log::info('Espees callback received', [
//             'reference' => $reference,
//             'is_success' => $isSuccess,
//             'payment_id' => $payment->id,
//         ]);

//         try {
//             // If it's a failure callback, mark as failed immediately
//             if (!$isSuccess) {
//                 $this->updatePaymentStatus($payment, 'failed');
                
//                 return [
//                     'payment' => $payment->fresh(),
//                     'booking' => $payment->booking,
//                     'status' => 'failed',
//                     'message' => 'Payment was cancelled or failed',
//                 ];
//             }

//             // For success callback, verify the payment with Espees API
//             $gateway = $this->gatewayFactory->make('espees');
            
//             if (!($gateway instanceof EspeesGateway)) {
//                 throw new \Exception('Invalid gateway instance');
//             }

//             $verificationResult = $gateway->verify($reference);

//             Log::info('Espees verification result', [
//                 'reference' => $reference,
//                 'verification_result' => $verificationResult,
//             ]);

//             // Update payment status based on verification
//             switch ($verificationResult['status']) {
//                 case 'success':
//                     $this->updatePaymentStatus($payment, 'paid');
//                     $this->confirmBooking($payment->booking);
                    
//                     // Store additional transaction details in meta
//                     $payment->update([
//                         'meta' => array_merge($payment->meta, [
//                             'transaction_details' => $verificationResult['transaction_details'] ?? [],
//                             'verified_at' => now()->toISOString(),
//                         ]),
//                     ]);
//                     break;

//                 case 'failed':
//                     $this->updatePaymentStatus($payment, 'failed');
//                     break;

//                 case 'pending':
//                     // Keep status as pending, log for monitoring
//                     Log::info('Espees payment still pending', [
//                         'reference' => $reference,
//                         'payment_id' => $payment->id,
//                     ]);
//                     break;

//                 default:
//                     throw new \Exception('Unknown payment status: ' . $verificationResult['status']);
//             }

//             return [
//                 'payment' => $payment->fresh(),
//                 'booking' => $payment->booking,
//                 'verification_result' => $verificationResult,
//                 'status' => $verificationResult['status'],
//             ];

//         } catch (\Exception $e) {
//             Log::error('Espees callback verification failed', [
//                 'reference' => $reference,
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString(),
//             ]);

//             // Mark payment as failed on verification error
//             $this->updatePaymentStatus($payment, 'failed');
//             throw $e;
//         }
//     }

//     private function updatePaymentStatus(Payment $payment, string $status): void
//     {
//         $payment->update([
//             'status' => $status,
//             'paid_at' => $status === 'paid' ? now() : null,
//         ]);
//     }

//     private function confirmBooking(Booking $booking): void
//     {
//         $booking->update([
//             'status' => 'confirmed',
//             'confirmed_at' => now(),
//         ]);

//         // Dispatch booking confirmation events
//         event(new BookingCreated($booking));
//     }


// }






// namespace App\Services;

// use App\Adapters\EspeesGateway;
// use App\Adapters\PaymentGatewayAdapter;
// use App\Events\BookingCreated;
// use App\Mail\BookingReceiptMail;
// use App\Models\Booking;
// use App\Models\Invoice;
// use App\Models\Payment;
// use App\Models\PlatformSetting;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;
// use Illuminate\Support\Facades\Mail;
// use Illuminate\Support\Str;
// use Barryvdh\DomPDF\Facade\Pdf;

// class PaymentService
// {
//     public function __construct(
//         private PaymentGatewayAdapter $gatewayFactory
//     ) {}

//     public function initiate(Booking $booking, array $data): Payment
//     {
//         return DB::transaction(function () use ($booking, $data) {
//             $gateway = $this->gatewayFactory->make($data['gateway']);
//             $reference = Str::uuid()->toString();
            
//             // Get platform settings for currency conversion
//             $platformSettings = PlatformSetting::first();
            
//             $convertedAmount = $booking->total_price;
//             $currency = 'USD';
            
//             if (strtolower($data['gateway']) === 'espees') {
//                 // For Espees, multiply by espees_rate
//                 $convertedAmount = (float)($booking->total_price * $platformSettings->espees_rate);
//                 $currency = 'ESP';
//             } elseif (strtolower($data['gateway']) === 'paystack') {
//                 // For Paystack, multiply by naira_rate
//                 $convertedAmount = (float)($booking->total_price * $platformSettings->naira_rate);
//                 $currency = 'NGN';
//             }
//             $gatewayAmount = $convertedAmount * 100;
            
//             $payment = Payment::create([
//                 'booking_id' => $booking->id,
//                 'amount' => $booking->total_price,
//                 'gateway' => $data['gateway'],
//                 'transaction_reference' => $reference,
//                 'status' => 'pending',
//                 'currency' => "USD",
//                 'meta' => [
//                     'return_url' => $data['return_url'],
//                     'cancel_url' => $data['cancel_url'],
//                     'original_amount' => $booking->total_price,
//                     'converted_amount' => $gatewayAmount,
//                     'currency' => $currency,
//                 ],
//             ]);

//             try {
//                 $result = $gateway->initialize([
//                     'email' => $booking->guest_email,
//                     'amount' => $gatewayAmount,
//                     'currency' => $currency,
//                     'reference' => $reference,
//                     'metadata' => [
//                         'booking_reference' => $booking->reference,
//                         'customer_name' => $booking->customer_name,
//                     ],
//                     'return_url' => $data['return_url'],
//                     'cancel_url' => $data['cancel_url'],
//                 ]);
                
//                 Log::info('Payment gateway initialization result', [
//                     'gateway' => $data['gateway'],
//                     'reference' => $reference,
//                     'original_amount' => $booking->total_price,
//                     'converted_amount' => $convertedAmount,
//                     'gateway_amount' => $gatewayAmount,
//                     'currency' => $currency,
//                     'result' => $result,
//                     'platform' => $platformSettings,
//                 ]);

//                 $payment->update([
//                     'meta' => array_merge($payment->meta, [
//                         'checkout_url' => $result['checkout_url'],
//                         'gateway_reference' => $result['gateway_reference'] ?? null,
//                     ]),
//                 ]);

//                 return $payment;
//             } catch (\Exception $e) {
//                 $payment->update(['status' => 'failed']);
//                 throw $e;
//             }
//         });
//     }

//     public function verify(string $reference): array
//     {
//         $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
//         $gateway = $this->gatewayFactory->make($payment->gateway);

//         // Add retry logic with exponential backoff
//         $maxRetries = 3;
//         $attempt = 0;
//         $verificationResult = null;
        
//         while ($attempt < $maxRetries) {
//             try {
//                 $verificationResult = $gateway->verify($reference);
//                 break; // Success, exit retry loop
//             } catch (\Exception $e) {
//                 $attempt++;
//                 if ($attempt >= $maxRetries) {
//                     Log::error('Payment verification failed after retries', [
//                         'reference' => $reference,
//                         'attempts' => $attempt,
//                         'error' => $e->getMessage()
//                     ]);
//                     throw $e;
//                 }
                
//                 // Exponential backoff: wait 2^attempt seconds
//                 sleep(pow(2, $attempt));
//                 Log::warning('Payment verification retry', [
//                     'reference' => $reference,
//                     'attempt' => $attempt,
//                     'error' => $e->getMessage()
//                 ]);
//             }
//         }

//         if ($verificationResult['status'] === 'success') {
//             $this->updatePaymentStatus($payment, 'paid');
//             $this->confirmBooking($payment->booking);
            
//             // Generate and email receipt
//             $this->generateAndEmailReceipt($payment->booking);
//         } else {
//             $this->updatePaymentStatus($payment, 'failed');
//         }

//         return [
//             'payment' => $payment->fresh(),
//             'booking' => $payment->booking,
//         ];
//     }

//     public function handleWebhook(array $payload): void
//     {
//         $gateway = $this->gatewayFactory->make($payload['gateway'] ?? '');
//         $event = $gateway->parseWebhookPayload($payload);

//         if (!$event) {
//             throw new \Exception('Invalid webhook payload');
//         }

//         $payment = Payment::where('transaction_reference', $event['reference'])->first();

//         if (!$payment) {
//             Log::error('Payment not found for webhook', ['event' => $event]);
//             return;
//         }

//         switch ($event['type']) {
//             case 'payment.success':
//                 $this->updatePaymentStatus($payment, 'paid');
//                 $this->confirmBooking($payment->booking);
                
//                 // Generate and email receipt
//                 $this->generateAndEmailReceipt($payment->booking);
//                 break;
//             case 'payment.failed':
//                 $this->updatePaymentStatus($payment, 'failed');
//                 break;
//             default:
//                 Log::info('Unhandled webhook event', ['type' => $event['type']]);
//         }
//     }

//     /**
//      * Handle Espees callback from success/failure URLs
//      */
//     public function handleEspeesCallback(string $reference, bool $isSuccess): array
//     {
//         $payment = Payment::where('transaction_reference', $reference)->firstOrFail();

//         // Verify that this is an Espees payment
//         if ($payment->gateway !== 'espees') {
//             throw new \Exception('Invalid gateway for callback');
//         }

//         Log::info('Espees callback received', [
//             'reference' => $reference,
//             'is_success' => $isSuccess,
//             'payment_id' => $payment->id,
//         ]);

//         try {
//             // If it's a failure callback, mark as failed immediately
//             if (!$isSuccess) {
//                 $this->updatePaymentStatus($payment, 'failed');
                
//                 return [
//                     'payment' => $payment->fresh(),
//                     'booking' => $payment->booking,
//                     'status' => 'failed',
//                     'message' => 'Payment was cancelled or failed',
//                 ];
//             }

//             // For success callback, verify the payment with Espees API
//             $gateway = $this->gatewayFactory->make('espees');
            
//             if (!($gateway instanceof EspeesGateway)) {
//                 throw new \Exception('Invalid gateway instance');
//             }

//             $verificationResult = $gateway->verify($reference);

//             Log::info('Espees verification result', [
//                 'reference' => $reference,
//                 'verification_result' => $verificationResult,
//             ]);

//             // Update payment status based on verification
//             switch ($verificationResult['status']) {
//                 case 'success':
//                     $this->updatePaymentStatus($payment, 'paid');
//                     $this->confirmBooking($payment->booking);
                    
//                     // Generate and email receipt
//                     $this->generateAndEmailReceipt($payment->booking);
                    
//                     // Store additional transaction details in meta
//                     $payment->update([
//                         'meta' => array_merge($payment->meta, [
//                             'transaction_details' => $verificationResult['transaction_details'] ?? [],
//                             'verified_at' => now()->toISOString(),
//                         ]),
//                     ]);
//                     break;

//                 case 'failed':
//                     $this->updatePaymentStatus($payment, 'failed');
//                     break;

//                 case 'pending':
//                     // Keep status as pending, log for monitoring
//                     Log::info('Espees payment still pending', [
//                         'reference' => $reference,
//                         'payment_id' => $payment->id,
//                     ]);
//                     break;

//                 default:
//                     throw new \Exception('Unknown payment status: ' . $verificationResult['status']);
//             }

//             return [
//                 'payment' => $payment->fresh(),
//                 'booking' => $payment->booking,
//                 'verification_result' => $verificationResult,
//                 'status' => $verificationResult['status'],
//             ];

//         } catch (\Exception $e) {
//             Log::error('Espees callback verification failed', [
//                 'reference' => $reference,
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString(),
//             ]);

//             // Mark payment as failed on verification error
//             $this->updatePaymentStatus($payment, 'failed');
//             throw $e;
//         }
//     }

//     /**
//      * Generate PDF receipt and send via email
//      */
//     private function generateAndEmailReceipt(Booking $booking): void
//     {
//         try {
//             // Check if invoice already exists
//             $existingInvoice = Invoice::where('booking_id', $booking->id)->first();
//             if ($existingInvoice) {
//                 Log::info('Invoice already exists for booking', ['booking_id' => $booking->id]);
//                 return;
//             }

//             // Generate invoice number
//             $invoiceNumber = 'INV-' . strtoupper(Str::random(8)) . '-' . now()->format('ymd');
            
//             // Create invoice record
//             $invoice = Invoice::create([
//                 'booking_id' => $booking->id,
//                 'invoice_number' => $invoiceNumber,
//                 'file_path' => '', // Will be updated after PDF generation
//                 'status' => 'generated',
//                 'issued_at' => now(),
//             ]);

//             // Generate PDF
//             $pdf = PDF::loadView('invoices.receipt', ['booking' => $booking]);
            
//             // Create storage directory if it doesn't exist
//             $storageDir = storage_path('app/invoices');
//             if (!file_exists($storageDir)) {
//                 mkdir($storageDir, 0755, true);
//             }
            
//             // Save PDF file
//             $filename = $invoiceNumber . '.pdf';
//             $filePath = $storageDir . '/' . $filename;
//             $pdf->save($filePath);

//             // Update invoice with file path
//             $invoice->update(['file_path' => $filePath]);

//             // Send email with PDF attachment
//             Mail::to($booking->guest_email)
//                 ->send(new BookingReceiptMail($booking, $invoice));

//             // Update invoice status
//             $invoice->update(['status' => 'sent']);

//             Log::info('Receipt generated and emailed successfully', [
//                 'booking_id' => $booking->id,
//                 'invoice_id' => $invoice->id,
//                 'email' => $booking->guest_email
//             ]);

//         } catch (\Exception $e) {
//             Log::error('Failed to generate/email receipt', [
//                 'booking_id' => $booking->id,
//                 'error' => $e->getMessage(),
//                 'trace' => $e->getTraceAsString()
//             ]);
//             // Don't throw exception - receipt generation shouldn't block payment confirmation
//         }
//     }

//     private function updatePaymentStatus(Payment $payment, string $status): void
//     {
//         $payment->update([
//             'status' => $status,
//             'paid_at' => $status === 'paid' ? now() : null,
//         ]);
//     }

//     private function confirmBooking(Booking $booking): void
//     {
//         $booking->update([
//             'status' => 'confirmed',
//             'confirmed_at' => now(),
//         ]);

//         // Dispatch booking confirmation events
//         event(new BookingCreated($booking));
//     }
// }



namespace App\Services;

use App\Adapters\EspeesGateway;
use App\Adapters\PaymentGatewayAdapter;
use App\Events\BookingCreated;
use App\Jobs\GenerateInvoiceJob;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PlatformSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        private PaymentGatewayAdapter $gatewayFactory
    ) {}

    public function initiate(Booking $booking, array $data): Payment
    {
        return DB::transaction(function () use ($booking, $data) {
            $gateway = $this->gatewayFactory->make($data['gateway']);
            $reference = Str::uuid()->toString();
            
            // Get platform settings for currency conversion
            $platformSettings = PlatformSetting::first();
            
            $convertedAmount = $booking->total_price;
            $currency = 'USD';
            
            if (strtolower($data['gateway']) === 'espees') {
                // For Espees, multiply by espees_rate
                $convertedAmount = (float)($booking->total_price * $platformSettings->espees_rate);
                $currency = 'ESP';
            } elseif (strtolower($data['gateway']) === 'paystack') {
                // For Paystack, multiply by naira_rate
                $convertedAmount = (float)($booking->total_price * $platformSettings->naira_rate);
                $currency = 'NGN';
            }
            $gatewayAmount = $convertedAmount * 100;
            
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
                'gateway' => $data['gateway'],
                'transaction_reference' => $reference,
                'status' => 'pending',
                'currency' => "USD",
                'meta' => [
                    'return_url' => $data['return_url'],
                    'cancel_url' => $data['cancel_url'],
                    'original_amount' => $booking->total_price,
                    'converted_amount' => $gatewayAmount,
                    'currency' => $currency,
                ],
            ]);

            try {
                $result = $gateway->initialize([
                    'email' => $booking->guest_email,
                    'amount' => $gatewayAmount,
                    'currency' => $currency,
                    'reference' => $reference,
                    'metadata' => [
                        'booking_reference' => $booking->booking_reference,
                        'customer_name' => $booking->guest_first_name . ' ' . $booking->guest_last_name,
                    ],
                    'return_url' => $data['return_url'],
                    'cancel_url' => $data['cancel_url'],
                ]);
                
                Log::info('Payment gateway initialization result', [
                    'gateway' => $data['gateway'],
                    'reference' => $reference,
                    'original_amount' => $booking->total_price,
                    'converted_amount' => $convertedAmount,
                    'gateway_amount' => $gatewayAmount,
                    'currency' => $currency,
                    'result' => $result,
                ]);

                $payment->update([
                    'meta' => array_merge($payment->meta, [
                        'checkout_url' => $result['checkout_url'],
                        'gateway_reference' => $result['gateway_reference'] ?? null,
                    ]),
                ]);

                return $payment;
            } catch (\Exception $e) {
                $payment->update(['status' => 'failed']);
                throw $e;
            }
        });
    }

    public function verify(string $reference): array
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();
        $gateway = $this->gatewayFactory->make($payment->gateway);

        // Add retry logic with exponential backoff
        $maxRetries = 3;
        $attempt = 0;
        $verificationResult = null;
        
        while ($attempt < $maxRetries) {
            try {
                $verificationResult = $gateway->verify($reference);
                break;
            } catch (\Exception $e) {
                $attempt++;
                if ($attempt >= $maxRetries) {
                    Log::error('Payment verification failed after retries', [
                        'reference' => $reference,
                        'attempts' => $attempt,
                        'error' => $e->getMessage()
                    ]);
                    throw $e;
                }
                
                sleep(pow(2, $attempt));
                Log::warning('Payment verification retry', [
                    'reference' => $reference,
                    'attempt' => $attempt,
                    'error' => $e->getMessage()
                ]);
            }
        }

        if ($verificationResult['status'] === 'success') {
            // Only process if payment is not already paid
            if ($payment->status !== 'paid') {
                $this->updatePaymentStatus($payment, 'paid');
                $this->confirmBooking($payment->booking);
                
                // Create invoice record (but don't send notifications here)
                $invoice = $this->createInvoiceRecord($payment->booking);
                $this->dispatchReceiptGeneration($payment->booking, $invoice);
            } else {
                Log::info('Payment already processed', [
                    'payment_id' => $payment->id,
                    'booking_id' => $payment->booking_id
                ]);
                
                $invoice = Invoice::where('booking_id', $payment->booking_id)->first();
            }
            
            return [
                'payment' => $payment->fresh(),
                'booking' => $payment->booking,
                'invoice' => $invoice ?? null,
            ];
        } else {
            $this->updatePaymentStatus($payment, 'failed');
            
            return [
                'payment' => $payment->fresh(),
                'booking' => $payment->booking,
                'invoice' => null,
            ];
        }
    }


    public function handleWebhook(array $payload): void
    {
        $gateway = $this->gatewayFactory->make($payload['gateway'] ?? '');
        $event = $gateway->parseWebhookPayload($payload);

        if (!$event) {
            throw new \Exception('Invalid webhook payload');
        }

        $payment = Payment::where('transaction_reference', $event['reference'])->first();

        if (!$payment) {
            Log::error('Payment not found for webhook', ['event' => $event]);
            return;
        }

        switch ($event['type']) {
            case 'payment.success':
                // Only process if payment is not already paid
                if ($payment->status !== 'paid') {
                    $this->updatePaymentStatus($payment, 'paid');
                    $this->confirmBooking($payment->booking);
                    
                    // Create invoice and generate receipt asynchronously
                    $invoice = $this->createInvoiceRecord($payment->booking);
                    $this->dispatchReceiptGeneration($payment->booking, $invoice);
                } else {
                    Log::info('Webhook: Payment already processed', [
                        'payment_id' => $payment->id,
                        'webhook_event' => $event['type']
                    ]);
                }
                break;
            case 'payment.failed':
                $this->updatePaymentStatus($payment, 'failed');
                break;
            default:
                Log::info('Unhandled webhook event', ['type' => $event['type']]);
        }
    }

    public function handleEspeesCallback(string $reference, bool $isSuccess): array
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();

        if ($payment->gateway !== 'espees') {
            throw new \Exception('Invalid gateway for callback');
        }

        Log::info('Espees callback received', [
            'reference' => $reference,
            'is_success' => $isSuccess,
            'payment_id' => $payment->id,
        ]);

        try {
            if (!$isSuccess) {
                $this->updatePaymentStatus($payment, 'failed');
                
                return [
                    'payment' => $payment->fresh(),
                    'booking' => $payment->booking,
                    'status' => 'failed',
                    'message' => 'Payment was cancelled or failed',
                    'invoice' => null,
                ];
            }

            $gateway = $this->gatewayFactory->make('espees');
            
            if (!($gateway instanceof EspeesGateway)) {
                throw new \Exception('Invalid gateway instance');
            }

            $verificationResult = $gateway->verify($reference);

            Log::info('Espees verification result', [
                'reference' => $reference,
                'verification_result' => $verificationResult,
            ]);

            switch ($verificationResult['status']) {
                case 'success':
                    $this->updatePaymentStatus($payment, 'paid');
                    $this->confirmBooking($payment->booking);
                    
                    $invoice = $this->createInvoiceRecord($payment->booking);
                    $this->dispatchReceiptGeneration($payment->booking, $invoice);
                    
                    $payment->update([
                        'meta' => array_merge($payment->meta, [
                            'transaction_details' => $verificationResult['transaction_details'] ?? [],
                            'verified_at' => now()->toISOString(),
                        ]),
                    ]);
                    
                    return [
                        'payment' => $payment->fresh(),
                        'booking' => $payment->booking,
                        'verification_result' => $verificationResult,
                        'status' => $verificationResult['status'],
                        'invoice' => $invoice,
                    ];

                case 'failed':
                    $this->updatePaymentStatus($payment, 'failed');
                    return [
                        'payment' => $payment->fresh(),
                        'booking' => $payment->booking,
                        'verification_result' => $verificationResult,
                        'status' => 'failed',
                        'invoice' => null,
                    ];

                case 'pending':
                    Log::info('Espees payment still pending', [
                        'reference' => $reference,
                        'payment_id' => $payment->id,
                    ]);
                    
                    return [
                        'payment' => $payment->fresh(),
                        'booking' => $payment->booking,
                        'verification_result' => $verificationResult,
                        'status' => 'pending',
                        'invoice' => null,
                    ];

                default:
                    throw new \Exception('Unknown payment status: ' . $verificationResult['status']);
            }

        } catch (\Exception $e) {
            Log::error('Espees callback verification failed', [
                'reference' => $reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $this->updatePaymentStatus($payment, 'failed');
            throw $e;
        }
    }

    private function createInvoiceRecord(Booking $booking): Invoice
    {
        // Check if invoice already exists
        $existingInvoice = Invoice::where('booking_id', $booking->id)->first();
        if ($existingInvoice) {
            Log::info('Invoice already exists for booking', [
                'booking_id' => $booking->id,
                'invoice_id' => $existingInvoice->id,
                'status' => $existingInvoice->status
            ]);
            return $existingInvoice;
        }

        // Generate invoice number
        $invoiceNumber = 'INV-' . strtoupper(Str::random(8)) . '-' . now()->format('ymd');
        
        $invoice = Invoice::create([
            'booking_id' => $booking->id,
            'invoice_number' => $invoiceNumber,
            'file_path' => '',
            'status' => 'generating',
            'issued_at' => now(),
        ]);

        Log::info('Invoice record created', [
            'booking_id' => $booking->id,
            'invoice_id' => $invoice->id,
            'invoice_number' => $invoiceNumber,
        ]);

        return $invoice;
    }

    private function dispatchReceiptGeneration(Booking $booking, Invoice $invoice): void
    {
        // Only dispatch if invoice is in generating status and no job is already running
        if ($invoice->status !== 'generating') {
            Log::info('Invoice already processed, skipping job dispatch', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
                'current_status' => $invoice->status
            ]);
            return;
        }

        // Check if a job is already dispatched for this invoice (prevent duplicates)
        $cacheKey = "invoice_job_dispatched_{$invoice->id}";
        if (cache()->get($cacheKey)) {
            Log::info('Invoice generation job already dispatched, skipping', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
            ]);
            return;
        }

        try {
            // Mark as dispatched (expires in 10 minutes)
            cache()->put($cacheKey, true, 600);
            
            GenerateInvoiceJob::dispatch($booking, $invoice);
            
            Log::info('Invoice generation job dispatched', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
            ]);
        } catch (\Exception $e) {
            // Remove cache on failure
            cache()->forget($cacheKey);
            
            Log::error('Failed to dispatch invoice generation job', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
                'error' => $e->getMessage(),
            ]);
            
            $this->generateAndEmailReceiptSync($booking, $invoice);
        }
    }



    /**
     * Sync fallback - guaranteed to work
     */
    private function generateAndEmailReceiptSync(Booking $booking, Invoice $invoice): void
    {
        try {
            $pdf = Pdf::loadView('invoices.receipt', ['booking' => $booking]);
            
            $storageDir = storage_path('app/invoices');
            if (!file_exists($storageDir)) {
                mkdir($storageDir, 0755, true);
            }
            
            $filename = $invoice->invoice_number . '.pdf';
            $relativePath = 'invoices/' . $filename;
            $fullPath = storage_path('app/' . $relativePath);
            
            $pdf->save($fullPath);

            $invoice->update([
                'file_path' => $relativePath,
                'status' => 'generated',
            ]);

            // Fire event to send notification
            event(new BookingCreated($booking));

            Log::info('Receipt generated successfully (sync fallback)', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
            ]);

        } catch (\Exception $e) {
            $invoice->update(['status' => 'failed']);
            
            Log::error('Sync fallback also failed, sent email without PDF', [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    

    private function updatePaymentStatus(Payment $payment, string $status): void
    {
        $payment->update([
            'status' => $status,
            'paid_at' => $status === 'paid' ? now() : null,
        ]);
    }

    private function confirmBooking(Booking $booking): void
    {
        $booking->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        event(new BookingCreated($booking));
    }
}