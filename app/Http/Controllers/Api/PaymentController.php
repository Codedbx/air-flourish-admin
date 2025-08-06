<?php

// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use App\Http\Requests\PaymentRequest;
// use App\Models\Booking;
// use App\Services\PaymentService;
// use Illuminate\Http\JsonResponse;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Log;

// class PaymentController extends Controller
// {


//      public function __construct(
//         private PaymentService $paymentService
//     ) {}

//     public function initiate(PaymentRequest $request): JsonResponse
//     {
//         $booking = Booking::where('booking_reference', $request->reference)->firstOrFail();

//         Log::info("request", [$request->all()]);
//         if ($booking->status !== 'pending') {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Booking is not in pending status',
//             ], 400);
//         }

//         try {
//             $payment = $this->paymentService->initiate($booking, $request->validated());

//             return response()->json([
//                 'status' => 'success',
//                 'message' => 'Payment initiated successfully',
//                 'data' => [
//                     'payment' => $payment,
//                     'redirect_url' => $payment->meta['checkout_url'] ?? null,
//                 ],
//             ]);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment initiation failed: ' . $e->getMessage(),
//             ], 400);
//         }
//     }

//     public function verify(string $reference): JsonResponse
//     {
//         try {
//             $result = $this->paymentService->verify($reference);

//             return response()->json([
//                 'status' => 'success',
//                 'message' => 'Payment verification successful',
//                 'data' => $result,
//             ]);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment verification failed: ' . $e->getMessage(),
//             ], 400);
//         }
//     }

//     public function webhook(): JsonResponse
//     {
//         try {
//             $payload = request()->all();
//             $this->paymentService->handleWebhook($payload);

//             return response()->json([
//                 'status' => 'success',
//                 'message' => 'Webhook processed successfully',
//             ]);
//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Webhook processing failed: ' . $e->getMessage(),
//             ], 400);
//         }
//     }


//     /**
//      * Handle Espees success callback
//      */
//     public function espeesSuccess(Request $request): JsonResponse
//     {
//         $reference = $request->get('reference');
        
//         if (!$reference) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Invalid payment reference',
//             ], 400);
//         }

//         try {
//             $result = $this->paymentService->handleEspeesCallback($reference, true);

//             return response()->json([
//                 'status' => 'success',
//                 'message' => 'Payment completed successfully',
//                 'data' => $result,
//             ]);
//         } catch (\Exception $e) {
//             Log::error('Espees success callback error', [
//                 'reference' => $reference,
//                 'error' => $e->getMessage(),
//             ]);

//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment verification failed: ' . $e->getMessage(),
//             ], 400);
//         }
//     }

//     /**
//      * Handle Espees failure callback
//      */
//     public function espeesFailed(Request $request): JsonResponse
//     {
//         $reference = $request->get('reference');
        
//         if (!$reference) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Invalid payment reference',
//             ], 400);
//         }

//         try {
//             $result = $this->paymentService->handleEspeesCallback($reference, false);

//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment was cancelled or failed',
//                 'data' => $result,
//             ]);
//         } catch (\Exception $e) {
//             Log::error('Espees failure callback error', [
//                 'reference' => $reference,
//                 'error' => $e->getMessage(),
//             ]);

//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Payment processing failed: ' . $e->getMessage(),
//             ], 400);
//         }
//     }

    
    
// }




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

        Log::info("Payment initiation request", [$request->all()]);
        
        if ($booking->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking is not in pending status',
            ], 400);
        }

        try {
            // Add timeout context for payment initiation
            $timeoutContext = stream_context_create([
                'http' => [
                    'timeout' => 30 // 30 second timeout
                ]
            ]);

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
            Log::error('Payment initiation failed', [
                'booking_reference' => $request->reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment initiation failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function verify(string $reference): JsonResponse
    {
        try {
            set_time_limit(60);
            
            $result = $this->paymentService->verify($reference);
            
            if ($result['payment']->status === 'paid') {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment verified successfully',
                    'data' => [
                        // Receipt essentials
                        'receipt_url' => $result['invoice']?->signed_download_url,
                        'receipt_status' => $result['invoice']?->status,
                        'email_sent' => $result['booking']->guest_email,
                        'additional_info' => $this->getReceiptStatusMessage($result['invoice']?->status),
                        
                        // Invoice essentials
                        'invoice_details' => [
                            'traveler_name' => $result['booking']->guest_first_name . ' ' . $result['booking']->guest_last_name,
                            'booking_date' => $result['booking']->created_at->format('Y-m-d H:i:s'),
                            'booking_reference' => $result['booking']->booking_reference,
                            'transaction_reference' => $result['payment']->transaction_reference,
                            'total_amount_paid' => number_format($result['booking']->total_price, 2),
                            'package_name' => $result['booking']->package->title,
                            'number_of_travelers' => $result['booking']->pax_count,
                            'hotel_checkin' => $result['booking']->package->hotel_checkin?->format('Y-m-d'),
                            'hotel_checkout' => $result['booking']->package->hotel_checkout?->format('Y-m-d'),
                            'package_image' => $this->getPackageImage($result['booking']->package),
                        ],
                    ],
                ]);
            } else {
                return response()->json([
                    'status' => 'failed',
                    'message' => 'Payment verification failed',
                    'data' => [
                        'booking_reference' => $result['booking']->booking_reference,
                        'payment_status' => $result['payment']->status,
                    ],
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'reference' => $reference,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

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
            
            // Add basic fraud detection - check for suspicious patterns
            $this->performBasicFraudDetection($payload);
            
            $this->paymentService->handleWebhook($payload);

            return response()->json([
                'status' => 'success',
                'message' => 'Webhook processed successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'payload' => request()->all(),
                'error' => $e->getMessage(),
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

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
            
            if ($result['status'] === 'success') {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment completed successfully',
                    'data' => [
                        'receipt_url' => $result['invoice']?->signed_download_url,
                        'receipt_status' => $result['invoice']?->status,
                        'email_sent' => $result['booking']->guest_email,
                        'additional_info' => $this->getReceiptStatusMessage($result['invoice']?->status),
                        
                        
                        'invoice_details' => [
                            'traveler_name' => $result['booking']->guest_first_name . ' ' . $result['booking']->guest_last_name,
                            'booking_date' => $result['booking']->created_at->format('Y-m-d H:i:s'),
                            'booking_reference' => $result['booking']->booking_reference,
                            'transaction_reference' => $result['payment']->transaction_reference,
                            'total_amount_paid' => number_format($result['booking']->total_price, 2),
                            'package_name' => $result['booking']->package->title,
                            'number_of_travelers' => $result['booking']->pax_count,
                            'hotel_checkin' => $result['booking']->package->hotel_checkin?->format('Y-m-d'),
                            'hotel_checkout' => $result['booking']->package->hotel_checkout?->format('Y-m-d'),
                            'package_image' => $this->getPackageImage($result['booking']->package),
                        ],
                    ],
                ]);
            } else {
                return response()->json([
                    'status' => $result['status'],
                    'message' => $result['status'] === 'pending' ? 'Payment is still being processed' : 'Payment verification failed',
                    'data' => [
                        'booking_reference' => $result['booking']->booking_reference,
                        'payment_status' => $result['status'],
                    ],
                ], $result['status'] === 'pending' ? 202 : 400);
            }
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

    private function getReceiptStatusMessage(?string $status): string
    {
        return match($status) {
            'generating' => 'Your receipt is being prepared and will be emailed to you shortly. You can also download it using the provided link once it\'s ready.',
            'generated' => 'Your receipt is ready for download. An email with the receipt has also been sent to you.',
            'sent' => 'Your receipt has been emailed to you and is available for download.',
            'failed' => 'There was an issue generating your receipt. Please contact support if you need assistance.',
            null => 'Receipt generation is in progress. Please check your email for the receipt.',
            default => 'Your receipt is being processed. Please check your email or try the download link.',
        };
    }

    private function performBasicFraudDetection(array $payload): void
    {
        $ip = request()->ip();
        $userAgent = request()->userAgent();
        
        $suspiciousIndicators = [];
        
        $recentRequests = cache()->get("webhook_requests_{$ip}", 0);
        if ($recentRequests > 10) {
            $suspiciousIndicators[] = 'High frequency requests from IP';
        }
        cache()->put("webhook_requests_{$ip}", $recentRequests + 1, 60);
        
        $suspiciousAgents = ['bot', 'crawler', 'scanner', 'hack'];
        foreach ($suspiciousAgents as $agent) {
            if (stripos($userAgent, $agent) !== false) {
                $suspiciousIndicators[] = 'Suspicious user agent';
                break;
            }
        }
        
        if (empty($payload) || (!isset($payload['event']) && !isset($payload['type']))) {
            $suspiciousIndicators[] = 'Invalid webhook payload structure';
        }
        
        if (!empty($suspiciousIndicators)) {
            Log::warning('Suspicious webhook activity detected', [
                'ip' => $ip,
                'user_agent' => $userAgent,
                'indicators' => $suspiciousIndicators,
                'payload' => $payload
            ]);
        }
    }

    /**
     * Get package image URL
     */
    private function getPackageImage($package): ?string
    {
        try {
            // Check if package has media (using Spatie Media Library)
            if (method_exists($package, 'getFirstMediaUrl')) {
                $imageUrl = $package->getFirstMediaUrl('package_images');
                if ($imageUrl) {
                    return $imageUrl;
                }
            }
            
            // Fallback: check if package has a direct image field
            if (isset($package->image) && $package->image) {
                return asset('storage/' . $package->image);
            }
            
            // Fallback: check for images in package_images directory
            $packageImagePath = 'images/packages/' . $package->id . '.jpg';
            if (file_exists(public_path($packageImagePath))) {
                return asset($packageImagePath);
            }
            
            // Alternative extensions
            $extensions = ['png', 'jpeg', 'webp'];
            foreach ($extensions as $ext) {
                $packageImagePath = 'images/packages/' . $package->id . '.' . $ext;
                if (file_exists(public_path($packageImagePath))) {
                    return asset($packageImagePath);
                }
            }
            
            // Default placeholder
            return asset('images/package-placeholder.png');
            
        } catch (\Exception $e) {
            Log::warning('Failed to get package image', [
                'package_id' => $package->id,
                'error' => $e->getMessage()
            ]);
            return asset('images/package-placeholder.png');
        }
    }
}
