<?php

namespace App\Services;

use App\Events\BookingCreated;
use App\Models\ActivityTimeSlot;
use App\Models\Booking;
use App\Models\Coupon;
use App\Models\Package;
use App\Models\PackageAddon;
use App\Models\PlatformSetting;
use App\Repositories\BookingRepository;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BookingService
{
    public function __construct(
        private BookingRepository $bookingRepository
    ) {}

    
     public function getBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        if (!$booking) {
            throw new \Exception("Booking not found.");
        }
        return $booking;
    }

//     public function createBooking(array $data): Booking
// {
//     return DB::transaction(function () use ($data) {
//         // 1) Load package with all needed relations
//         $package = Package::with(['activities', 'activities.timeSlots', /* add any other relations you need */])
//                           ->findOrFail($data['package_id']);

//         if (! $package->is_active) {
//             throw new \Exception('This package is no longer available.');
//         }
//         if (now()->lt($package->booking_start_date) || now()->gt($package->booking_end_date)) {
//             throw new \Exception('Booking window for this package has closed or not yet opened.');
//         }

//         $pax               = $data['pax_count'];
//         $basePrice         = $package->base_price;
//         $activitiesTotal   = $package->activities->sum('price');

//         // 2) Compute agent add‐on
//         $agentAddonPerPerson = $package->agent_addon_type === 'fixed'
//             ? $package->agent_addon_amount
//             : ($basePrice * $package->agent_addon_amount / 100);

//         // 3) Try to load admin (platform) settings — but if none exist, default to zero
//         $adminSetting = PlatformSetting::first();
//         if ($adminSetting) {
//             $withAgent = $basePrice + $activitiesTotal + $agentAddonPerPerson;
//             $adminAddonPerPerson = $adminSetting->admin_addon_type === 'fixed'
//                 ? $adminSetting->admin_addon_amount
//                 : ($withAgent * $adminSetting->admin_addon_amount / 100);
//         } else {
//             // no settings row ⇒ no extra admin add‐on
//             $adminAddonPerPerson = 0;
//         }

//         $totalPerPerson = $basePrice + $activitiesTotal + $agentAddonPerPerson + $adminAddonPerPerson;
//         $totalPriceAll  = $totalPerPerson * $pax;

//         // 4) Snapshot each chosen slot
//         $snapshotActivities = [];
//         foreach ($data['slots'] as $slotChoice) {
//             $timeSlot = ActivityTimeSlot::findOrFail($slotChoice['slot_id']);

//             if (
//                 $timeSlot->starts_at->toDateTimeString() !== $slotChoice['slot_start'] ||
//                 $timeSlot->ends_at->toDateTimeString()   !== $slotChoice['slot_end']
//             ) {
//                 throw new \Exception("Time slot {$timeSlot->id} has changed. Please refresh and try again.");
//             }

//             $snapshotActivities[] = [
//                 'activity_id'    => $timeSlot->activity_id,
//                 'activity_title' => $timeSlot->activity->title,
//                 'activity_price' => $timeSlot->activity->price,
//                 'slot_id'        => $timeSlot->id,
//                 'slot_start'     => $timeSlot->starts_at->toDateTimeString(),
//                 'slot_end'       => $timeSlot->ends_at->toDateTimeString(),
//             ];
//         }

//         // 5) Snapshot the _entire_ package (including relations) as an array
//         $packageSnapshot = $package->toArray();

//         $snapshot = [
//             'package'                  => $packageSnapshot,
//             'activities'               => $snapshotActivities,
//             'agent_addon_per_person'   => $agentAddonPerPerson,
//             'admin_addon_per_person'   => $adminAddonPerPerson,
//             'total_price_per_person'   => $totalPerPerson,
//             'total_price_all'          => $totalPriceAll,
//             'group_size'               => $pax,
//         ];

//         Log::info('Booking snapshot created', [
//             'package_id'      => $package->id,
//             'pax_count'       => $pax,
//             'base_price'      => $basePrice,
//             'total_price_all' => $totalPriceAll,
//             'snapshot'        => $snapshot,
//         ]);

//         // 6) Create the booking
//         $booking = $this->bookingRepository->create([
//             'user_id'                => Auth::id(),
//             'guest_first_name'       => $data['guest_first_name'],
//             'guest_last_name'        => $data['guest_last_name'],
//             'guest_email'            => $data['guest_email'],
//             'guest_phone'            => $data['guest_phone'] ?? null,
//             'guest_country'          => $data['guest_country'] ?? null,
//             'guest_city'             => $data['guest_city'] ?? null,
//             'guest_zip_code'         => $data['guest_zip_code'] ?? null,
//             'guest_gender'           => $data['guest_gender'] ?? null,
//             'package_id'             => $package->id,
//             'pax_count'              => $pax,
//             'base_price'             => $basePrice,
//             'activities_total'       => $activitiesTotal,
//             'computed_agent_addon'   => $agentAddonPerPerson,
//             'computed_admin_addon'   => $adminAddonPerPerson,
//             'total_price_per_person' => $totalPerPerson,
//             'total_price'            => $totalPriceAll,
//             'status'                 => 'pending',
//             'snapshot'               => json_encode($snapshot),
//         ]);

//         if (! $booking instanceof Booking || $booking->id === null) {
//             Log::error('Booking creation failed: invalid Booking instance.', ['data' => $data]);
//             throw new \RuntimeException('Booking record could not be created.');
//         }

//         event(new BookingCreated($booking));

//         return $booking;
//     });
// }


public function createBooking(array $data): Booking
{
    return DB::transaction(function () use ($data) {
        $paxCount = $data['pax_count'];

        // Load package
        $package = Package::with('activities')->findOrFail($data['package_id']);

        if (! $package->is_active) {
            throw new Exception('This package is no longer available.');
        }

        if (now()->lt($package->booking_start_date) || now()->gt($package->booking_end_date)) {
            throw new \Exception('Booking window for this package is closed.');
        }

        // Calculate per-component values
        $baseTotal         = $package->base_price * $paxCount;
        $activitiesTotal   = $package->total_activities_price * $paxCount;
        $agentAddonTotal   = $package->agent_addon_price * $paxCount;
        $adminAddonTotal   = $package->admin_addon_price * $paxCount;
        $preDiscountTotal  = $baseTotal + $activitiesTotal + $agentAddonTotal + $adminAddonTotal;

        // Handle coupon
        $discountAmount = 0;
        $couponId = null;

        if (!empty($data['coupon_id'])) {
            $coupon = Coupon::findOrFail($data['coupon_id']);

            if (! $coupon->isValidFor($package)) {
                throw new Exception("Coupon is not valid for this package.");
            }

            $couponId = $coupon->id;

            if ($coupon->discount_type === 'fixed') {
                $discountAmount = $coupon->discount_value;
            } elseif ($coupon->discount_type === 'percentage') {
                $discountAmount = ($coupon->discount_value / 100) * $preDiscountTotal;
            }

            $discountAmount = min($discountAmount, $preDiscountTotal); // prevent negative totals
        }

        $finalTotal = $preDiscountTotal - $discountAmount;

        // Create booking
        $booking = $this->bookingRepository->create([
            'user_id'                => Auth::id(),
            'guest_first_name'       => $data['guest_first_name'],
            'guest_last_name'        => $data['guest_last_name'],
            'guest_email'            => $data['guest_email'],
            'guest_phone'            => $data['guest_phone'] ?? null,
            'guest_country'          => $data['guest_country'] ?? null,
            'guest_city'             => $data['guest_city'] ?? null,
            'guest_zip_code'         => $data['guest_zip_code'] ?? null,
            'guest_gender'           => $data['guest_gender'] ?? null,
            'package_id'             => $package->id,
            'pax_count'              => $paxCount,
            'base_price'             => $package->base_price,
            'activities_total'       => $activitiesTotal,
            'computed_agent_addon'   => $agentAddonTotal,
            'computed_admin_addon'   => $adminAddonTotal,
            'total_price_per_person' => $package->total_price,
            'total_price'            => round($finalTotal, 2),
            'coupon_id'              => $couponId,
            'discount_amount'        => round($discountAmount, 2),
            'status'                 => 'pending',
            'snapshot'               => json_encode([
                'package'        => $package->toArray(),
            ]),
        ]);

        return $booking;
    });
}



    public function getFilteredBookings(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->bookingRepository
                    ->filter($filters)
                    ->paginate($perPage)
                    ->withQueryString();
    }

    /**
     * Paginate only an agent’s own bookings.
     */
    public function getAgentBookings(int $agentId, array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->bookingRepository
                    ->filterForAgent($agentId, $filters)
                    ->paginate($perPage)
                    ->withQueryString();
    }

   


    public function confirmBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        if (! $booking) {
            throw new \Exception('Booking not found.');
        }
        return $this->bookingRepository->update($id, ['status' => 'confirmed']);
    }

    public function cancelBooking(int $id): Booking
    {
        $booking = $this->bookingRepository->find($id);
        if (! $booking) {
            throw new \Exception('Booking not found.');
        }
        return $this->bookingRepository->update($id, ['status' => 'cancelled']);
    }

    public function getUserBookings(?int $userId = null)
    {
        return $userId
            ? $this->bookingRepository->getByUser($userId)
            : $this->bookingRepository->all(); // for admins
    }
}

