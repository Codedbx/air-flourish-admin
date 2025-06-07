<?php

namespace App\Adapters;

use InvalidArgumentException;

class PaymentGatewayAdapter
{
    private array $gateways = [
        'stripe' => StripeGateway::class,
        'paystack' => PaystackGateway::class,
        'espees' => EspeesGateway::class,
    ];

    public function make(string $gateway): PaymentGatewayInterface
    {
        if (!isset($this->gateways[$gateway])) {
            throw new InvalidArgumentException("Unsupported payment gateway: {$gateway}");
        }

        $gatewayClass = $this->gateways[$gateway];
        return new $gatewayClass();
    }
}
