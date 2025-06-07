<?php

namespace App\Adapters;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Webhook;

class StripeGateway implements PaymentGatewayInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function initialize(array $data): array
    {
        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => strtolower($data['currency']),
                    'product_data' => [
                        'name' => 'Booking: ' . $data['metadata']['booking_reference'],
                    ],
                    'unit_amount' => $data['amount'],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => $data['return_url'] . '?reference=' . $data['reference'],
            'cancel_url' => $data['cancel_url'],
            'client_reference_id' => $data['reference'],
            'customer_email' => $data['email'],
            'metadata' => $data['metadata'],
        ]);

        return [
            'checkout_url' => $session->url,
            'gateway_reference' => $session->id,
        ];
    }

    public function verify(string $reference): array
    {
        $session = Session::retrieve($reference);

        return [
            'status' => $session->payment_status === 'paid' ? 'success' : 'pending',
            'gateway_reference' => $session->id,
            'amount' => $session->amount_total,
            'currency' => $session->currency,
        ];
    }

    public function parseWebhookPayload(array $payload): ?array
    {
        try {
            $event = Webhook::constructEvent(
                json_encode($payload),
                request()->header('Stripe-Signature'),
                config('services.stripe.webhook_secret')
            );

            $session = $event->data->object;

            return [
                'type' => match ($event->type) {
                    'checkout.session.completed' => 'payment.success',
                    'checkout.session.expired' => 'payment.failed',
                    default => null,
                },
                'reference' => $session->client_reference_id,
                'gateway_reference' => $session->id,
                'amount' => $session->amount_total,
                'currency' => $session->currency,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }
}