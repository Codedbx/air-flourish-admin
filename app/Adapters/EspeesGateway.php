<?php

namespace App\Adapters;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EspeesGateway implements PaymentGatewayInterface
{
    private string $baseUrl = 'https://api.espees.org/v2';
    private string $paymentUrl = 'https://payment.espees.org/pay';
    private string $apiKey;
    private string $merchantWallet;

    public function __construct()
    {
        $this->apiKey = config('services.espees.api_key');
        $this->merchantWallet = config('services.espees.merchant_wallet');
    }

    public function initialize(array $data): array
    {
        $amount = $data['amount'] / 100;

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-api-key' => $this->apiKey,
        ])->post($this->baseUrl . '/payment/product', [
            'product_sku' => $data['reference'],
            'narration' => 'Package Booking: ' . $data['metadata']['booking_reference'],
            'price' => $amount,
            'merchant_wallet' => $this->merchantWallet,
            'success_url' => $data['return_url'] . '?reference=' . $data['reference'],
            'fail_url' => $data['cancel_url'] . '?reference=' . $data['reference'],
            'user_data' => [
                'booking_reference' => $data['metadata']['booking_reference'],
                'customer_name' => $data['metadata']['customer_name'],
                'customer_email' => $data['email'],
                'transaction_reference' => $data['reference'],
            ],
        ]);

        if (!$response->successful()) {
            Log::error('Espees payment initialization failed', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);
            throw new \Exception('Failed to initialize Espees payment: ' . $response->body());
        }

        $result = $response->json();

        if ($result['statusCode'] !== 200) {
            throw new \Exception('Espees API error: ' . ($result['message'] ?? 'Unknown error'));
        }

        return [
            'checkout_url' => $this->paymentUrl . '/' . $result['payment_ref'],
            'gateway_reference' => $result['payment_ref'],
        ];
    }

    public function verify(string $reference): array
    {
        // For Espees, we need to get the payment_ref from the payment record
        // since the reference we have is our internal reference
        $payment = Payment::where('transaction_reference', $reference)->first();
        
        if (!$payment || !isset($payment->meta['gateway_reference'])) {
            throw new \Exception('Payment reference not found');
        }

        $paymentRef = $payment->meta['gateway_reference'];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-api-key' => $this->apiKey,
        ])->post($this->baseUrl . '/payment/confirm', [
            'payment_ref' => $paymentRef,
        ]);

        if (!$response->successful()) {
            Log::error('Espees payment verification failed', [
                'response' => $response->json(),
                'status' => $response->status(),
                'payment_ref' => $paymentRef,
            ]);
            throw new \Exception('Failed to verify Espees payment: ' . $response->body());
        }

        $result = $response->json();

        // Map Espees transaction status to our internal status
        $status = match ($result['transaction_status']) {
            'APPROVED' => 'success',
            'DECLINE' => 'failed',
            'PENDING' => 'pending',
            'NOT FOUND' => 'failed',
            default => 'failed',
        };

        return [
            'status' => $status,
            'gateway_reference' => $paymentRef,
            'amount' => $result['price'] * 100, // Convert back to cents
            'currency' => 'USD', // Espees uses their own currency, but we'll map to USD
            'transaction_details' => [
                'customer_username' => $result['customer_username'] ?? null,
                'transaction_date' => $result['transaction_date'] ?? null,
                'status_details' => $result['status_details'] ?? null,
            ],
        ];
    }

    public function parseWebhookPayload(array $payload): ?array
    {

        
        Log::info('Espees webhook received (not implemented)', ['payload' => $payload]);
        
        return null;
    }

    /**
     * Handle redirect callback from Espees
     * This method can be called from your controller when handling success/fail URLs
     */
    public function handleCallback(string $reference, bool $isSuccess): array
    {
        if (!$isSuccess) {
            return [
                'status' => 'failed',
                'message' => 'Payment was cancelled or failed',
            ];
        }

        // Verify the payment status
        return $this->verify($reference);
    }
}