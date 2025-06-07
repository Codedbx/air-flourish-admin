<?php

namespace App\Adapters;

interface PaymentGatewayInterface
{
    public function initialize(array $data): array;
    public function verify(string $reference): array;
    public function parseWebhookPayload(array $payload): ?array;
}