<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Services\BookingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService)
    {
        // Only authenticated admins and agents:
        // $this->middleware('auth');
        // $this->middleware('role:admin|agent');
    }

    /**
     * Display a paginated, filterable, sortable list of bookings.
     */
    public function index(Request $request): Response
    {
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

        // 2) Fetch the correct paginator
        if ($user->hasRole('admin')) {
            $paginator = $this->bookingService->getFilteredBookings($filters, $perPage);
        } else {
            $paginator = $this->bookingService->getAgentBookings($user->id, $filters, $perPage);
        }



        Log::info($paginator->toArray());

        

        // 4) Send to Inertia
        return Inertia::render('booking/bookings', [
            'filters'  => $filters,
            'bookings' => $paginator->toArray(),
        ]);
    }

    /**
     * Show single booking.
     */
    public function show(Request $request, int $id)
    {
        $booking = $this->bookingService->getBooking($id);


       

        return Inertia::render('booking/show', [
                'booking' => $booking->toArray(),
            ]);
    }

    /**
     * Create new booking.
     */
    public function store(StoreBookingRequest $request): RedirectResponse
    {
        $this->bookingService->createBooking($request->validated());

        return redirect()
            ->route('bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    /**
     * Confirm a booking (admin only).
     */
    public function confirm(int $id): RedirectResponse
    {
        $this->bookingService->confirmBooking($id);

        return back()->with('success', 'Booking confirmed.');
    }

    /**
     * Cancel a booking (user or admin).
     */
    public function cancel(Request $request, int $id): RedirectResponse
    {
        $booking = $this->bookingService->getBooking($id);

        if ($request->user()->cannot('cancel', $booking)) {
            abort(403);
        }

        $this->bookingService->cancelBooking($id);

        return back()->with('success', 'Booking cancelled.');
    }
}
