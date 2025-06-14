<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BookingController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private BookingService $bookingService)
    {

    }

    /**
     * Display a paginated, filterable, sortable list of bookings.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Booking::class);
        // 1) Gather filter & pagination inputs
        $filters = $request->only([
            'status',
            'date_from',
            'date_to',
            'search',
            'owner_search',
            'sort_by',
            'sort_order',
            'per_page',
        ]);

        $perPage = (int) ($filters['per_page'] ?? 15);
        $user    = $request->user();

        if (!$user->can('view all activities')) {
             $paginator = $this->bookingService->getAgentBookings($user->id, $filters, $perPage);
        }else{
            $paginator = $this->bookingService->getFilteredBookings($filters, $perPage);
        } 

        return Inertia::render('booking/bookings', [
            'filters'  => $filters,
            'bookings' => $paginator->toArray(),
        ]);
    }

    /**
     * Show single booking.
     */
    public function show(Request $request, Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking = $this->bookingService->getBooking($booking->id);

        return Inertia::render('booking/show', [
                'booking' => $booking->toArray(),
            ]);
    }

    /**
     * Create new booking.
     */
    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $this->authorize('create', Booking::class);

        $this->bookingService->createBooking($request->validated());

        return redirect()
            ->route('bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    /**
     * Confirm a booking (admin only).
     */
    public function confirm(Booking $booking): RedirectResponse
    {
        $this->authorize('update', $booking);

        $this->bookingService->confirmBooking($booking->id);

        return back()->with('success', 'Booking confirmed.');
    }

    /**
     * Cancel a booking (user or admin).
     */
    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorize('update', $booking);

        $booking = $this->bookingService->getBooking($booking->id);

        if ($request->user()->cannot('cancel', $booking)) {
            abort(403);
        }

        $this->bookingService->cancelBooking($booking->id);

        return back()->with('success', 'Booking cancelled.');
    }
}
