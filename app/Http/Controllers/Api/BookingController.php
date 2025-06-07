<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function __construct(
        private BookingService $bookingService
    ) {
        // $this->middleware('auth:sanctum');
    }

    public function index(): JsonResponse
    {
        $bookings = $this->bookingService->getUserBookings(auth()->id());

        return response()->json([
            'status' => 'success',
            'data' => $bookings,
        ]);
    }


    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            Log::info('Creating booking with data:', $request->all());
            $booking = $this->bookingService->createBooking($request->all());

            $paymentGateway = $request->input('payment_gateway'); 

            return response()->json([
                'status' => 'success',
                'message' => 'Booking created successfully.',
                'data' => [
                    'booking_id' => $booking->id,
                    'booking_reference' => $booking->booking_reference,
                    'payment_gateway' => $paymentGateway, 
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create booking. Please try again or contact support. ' . $e->getMessage(),
            ], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $booking = $this->bookingService->getBooking($id);

        if (!$booking || $booking->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $booking->load(['package', 'payment', 'invoice']),
        ]);
    }

    public function cancel(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->cancelBooking($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Booking cancelled successfully',
                'data' => $booking,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}