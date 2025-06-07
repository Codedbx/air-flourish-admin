<?php

namespace App\Adapters;

use Illuminate\Support\Facades\Http;

class PaystackGateway implements PaymentGatewayInterface
{
    private string $baseUrl = 'https://api.paystack.co';
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret');
    }

    public function initialize(array $data): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/transaction/initialize', [
            'amount' => $data['amount'],
            'email' => $data['email'],
            'currency' => $data['currency'],
            'reference' => $data['reference'],
            'callback_url' => $data['return_url'],
            'metadata' => $data['metadata'],
        ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to initialize Paystack payment: ' . $response->body());
        }

        $result = $response->json();

        return [
            'checkout_url' => $result['data']['authorization_url'],
            'gateway_reference' => $result['data']['reference'],
        ];
    }

    public function verify(string $reference): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secretKey,
        ])->get($this->baseUrl . '/transaction/verify/' . $reference);

        if (!$response->successful()) {
            throw new \Exception('Failed to verify Paystack payment: ' . $response->body());
        }

        $result = $response->json();

        return [
            'status' => $result['data']['status'] === 'success' ? 'success' : 'failed',
            'gateway_reference' => $result['data']['reference'],
            'amount' => $result['data']['amount'],
            'currency' => $result['data']['currency'],
        ];
    }

    public function parseWebhookPayload(array $payload): ?array
    {
        if (!$this->verifyWebhookSignature()) {
            return null;
        }

        return [
            'type' => match ($payload['event']) {
                'charge.success' => 'payment.success',
                'charge.failed' => 'payment.failed',
                default => null,
            },
            'reference' => $payload['data']['reference'],
            'gateway_reference' => $payload['data']['reference'],
            'amount' => $payload['data']['amount'],
            'currency' => $payload['data']['currency'],
        ];
    }

    private function verifyWebhookSignature(): bool
    {
        $signature = request()->header('X-Paystack-Signature');
        $computedSignature = hash_hmac('sha512', request()->getContent(), $this->secretKey);

        return hash_equals($signature, $computedSignature);
    }
}