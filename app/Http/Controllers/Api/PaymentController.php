<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Booking;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{


     public function __construct(
        private PaymentService $paymentService
    ) {}

    public function initiate(PaymentRequest $request): JsonResponse
    {
        $booking = Booking::where('booking_reference', $request->reference)->firstOrFail();

        if ($booking->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking is not in pending status',
            ], 400);
        }

        try {
            $payment = $this->paymentService->initiate($booking, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Payment initiated successfully',
                'data' => [
                    'payment' => $payment,
                    'redirect_url' => $payment->meta['checkout_url'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment initiation failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function verify(string $reference): JsonResponse
    {
        try {
            $result = $this->paymentService->verify($reference);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment verification successful',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function webhook(): JsonResponse
    {
        try {
            $payload = request()->all();
            $this->paymentService->handleWebhook($payload);

            return response()->json([
                'status' => 'success',
                'message' => 'Webhook processed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Webhook processing failed: ' . $e->getMessage(),
            ], 400);
        }
    }


    /**
     * Handle Espees success callback
     */
    public function espeesSuccess(Request $request): JsonResponse
    {
        $reference = $request->get('reference');
        
        if (!$reference) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid payment reference',
            ], 400);
        }

        try {
            $result = $this->paymentService->handleEspeesCallback($reference, true);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment completed successfully',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('Espees success callback error', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Handle Espees failure callback
     */
    public function espeesFailed(Request $request): JsonResponse
    {
        $reference = $request->get('reference');
        
        if (!$reference) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid payment reference',
            ], 400);
        }

        try {
            $result = $this->paymentService->handleEspeesCallback($reference, false);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment was cancelled or failed',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('Espees failure callback error', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment processing failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    
    
}