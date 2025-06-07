<?php

namespace App\Services;

use App\Adapters\EspeesGateway;
use App\Adapters\PaymentGatewayAdapter;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PlatformSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentService
{

     public function __construct(
        private PaymentGatewayAdapter $gatewayFactory
    ) {}

    // public function initiate(Booking $booking, array $data): Payment
    // {
    //     return DB::transaction(function () use ($booking, $data) {
    //         $gateway = $this->gatewayFactory->make($data['gateway']);
    //         $reference = Str::uuid()->toString();

    //         $payment = Payment::create([
    //             'booking_id' => $booking->id,
    //             'amount' => $booking->total_price,
    //             'gateway' => $data['gateway'],
    //             'transaction_reference' => $reference,
    //             'status' => 'pending',
    //             'meta' => [
    //                 'return_url' => $data['return_url'],
    //                 'cancel_url' => $data['cancel_url'],
    //             ],
    //         ]);

    //         try {
    //             $result = $gateway->initialize([
    //                 'email' => "emmanuel.gita@gmail.com",
    //                 'amount' => $booking->total_price * 100,
    //                 'currency' => 'NGN',
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
    //                 'result' => $result,
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
            // For Espees, divide by espees_rate
            $convertedAmount = (float)($booking->total_price * $platformSettings->espees_rate);
            $currency = 'ESP';
        } elseif (strtolower($data['gateway']) === 'paystack') {
            // For Paystack, divide by naira_rate
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
                'email' => "emmanuel.gita@gmail.com",
                'amount' => $gatewayAmount,
                'currency' => $currency,
                'reference' => $reference,
                'metadata' => [
                    'booking_reference' => $booking->reference,
                    'customer_name' => $booking->customer_name,
                    'original_amount' => $booking->total_price,
                    'converted_amount' => $convertedAmount,
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
                'platform' => $platformSettings,
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

        $verificationResult = $gateway->verify($reference);

        if ($verificationResult['status'] === 'success') {
            $this->updatePaymentStatus($payment, 'paid');
            $this->confirmBooking($payment->booking);
        } else {
            $this->updatePaymentStatus($payment, 'failed');
        }

        return [
            'payment' => $payment->fresh(),
            'booking' => $payment->booking,
        ];
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
                $this->updatePaymentStatus($payment, 'paid');
                $this->confirmBooking($payment->booking);
                break;
            case 'payment.failed':
                $this->updatePaymentStatus($payment, 'failed');
                break;
            default:
                Log::info('Unhandled webhook event', ['type' => $event['type']]);
        }
    }

    /**
     * Handle Espees callback from success/failure URLs
     */
    public function handleEspeesCallback(string $reference, bool $isSuccess): array
    {
        $payment = Payment::where('transaction_reference', $reference)->firstOrFail();

        // Verify that this is an Espees payment
        if ($payment->gateway !== 'espees') {
            throw new \Exception('Invalid gateway for callback');
        }

        Log::info('Espees callback received', [
            'reference' => $reference,
            'is_success' => $isSuccess,
            'payment_id' => $payment->id,
        ]);

        try {
            // If it's a failure callback, mark as failed immediately
            if (!$isSuccess) {
                $this->updatePaymentStatus($payment, 'failed');
                
                return [
                    'payment' => $payment->fresh(),
                    'booking' => $payment->booking,
                    'status' => 'failed',
                    'message' => 'Payment was cancelled or failed',
                ];
            }

            // For success callback, verify the payment with Espees API
            $gateway = $this->gatewayFactory->make('espees');
            
            if (!($gateway instanceof EspeesGateway)) {
                throw new \Exception('Invalid gateway instance');
            }

            $verificationResult = $gateway->verify($reference);

            Log::info('Espees verification result', [
                'reference' => $reference,
                'verification_result' => $verificationResult,
            ]);

            // Update payment status based on verification
            switch ($verificationResult['status']) {
                case 'success':
                    $this->updatePaymentStatus($payment, 'paid');
                    $this->confirmBooking($payment->booking);
                    
                    // Store additional transaction details in meta
                    $payment->update([
                        'meta' => array_merge($payment->meta, [
                            'transaction_details' => $verificationResult['transaction_details'] ?? [],
                            'verified_at' => now()->toISOString(),
                        ]),
                    ]);
                    break;

                case 'failed':
                    $this->updatePaymentStatus($payment, 'failed');
                    break;

                case 'pending':
                    // Keep status as pending, log for monitoring
                    Log::info('Espees payment still pending', [
                        'reference' => $reference,
                        'payment_id' => $payment->id,
                    ]);
                    break;

                default:
                    throw new \Exception('Unknown payment status: ' . $verificationResult['status']);
            }

            return [
                'payment' => $payment->fresh(),
                'booking' => $payment->booking,
                'verification_result' => $verificationResult,
                'status' => $verificationResult['status'],
            ];

        } catch (\Exception $e) {
            Log::error('Espees callback verification failed', [
                'reference' => $reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Mark payment as failed on verification error
            $this->updatePaymentStatus($payment, 'failed');
            throw $e;
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

        // Dispatch booking confirmation events
        // event(new BookingConfirmed($booking));
    }


}
