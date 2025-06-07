<?php

namespace App\Repositories;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class BookingRepository implements BookingRepositoryInterface
{
    public function all()
    {
        return Booking::with(['user', 'package', 'payment', 'invoice'])->get();
    }

    public function find(int $id): ?Booking
    {
        return Booking::with(['user', 'package', 'payment', 'invoice'])->find($id);
    }

    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(int $id, array $data): Booking
    {
        $booking = Booking::findOrFail($id);
        $booking->update($data);
        return $booking->fresh();
    }

    public function delete(int $id): bool
    {
        return Booking::destroy($id) > 0;
    }

    public function getByUser(int $userId)
    {
        return Booking::where('user_id', $userId)
            ->with(['package', 'payment', 'invoice'])
            ->orderBy('created_at', 'desc')
            ->get();
    }


    /**
     * Build a base query with joins for sorting on related columns.
     */
    // public function filter(array $f): Builder
    // {
    //     $q = Booking::query()
    //         ->leftJoin('users as bookers',   'bookings.user_id',        '=', 'bookers.id')
    //         ->leftJoin('packages',           'bookings.package_id',     '=', 'packages.id')
    //         ->leftJoin('users as owners',    'packages.owner_id',       '=', 'owners.id')
    //         ->select('bookings.*')
    //         ->with(['user', 'package.owner', 'payment', 'invoice']);

    //     // --- basic filters ---
    //     if (!empty($f['status'])) {
    //         $q->where('bookings.status', $f['status']);
    //     }
    //     if (!empty($f['date_from'])) {
    //         $q->whereDate('bookings.created_at', '>=', $f['date_from']);
    //     }
    //     if (!empty($f['date_to'])) {
    //         $q->whereDate('bookings.created_at', '<=', $f['date_to']);
    //     }
    //     if (!empty($f['search'])) {
    //         $term = "%{$f['search']}%";
    //         $q->where(function($q2) use ($term) {
    //             $q2->where('bookings.booking_reference', 'like', $term)
    //                ->orWhereRaw("CONCAT(bookings.guest_first_name,' ',bookings.guest_last_name) LIKE ?", [$term])
    //                ->orWhere('bookers.name', 'like', $term);
    //         });
    //     }

    //     // --- owner filters ---
    //     if (!empty($f['owner_id'])) {
    //         $q->where('packages.owner_id', $f['owner_id']);
    //     }
    //     if (!empty($f['owner_search'])) {
    //         $term = "%{$f['owner_search']}%";
    //         $q->where(function($q2) use ($term) {
    //             $q2->where('owners.name', 'like', $term)
    //                ->orWhere('owners.business_name', 'like', $term);
    //         });
    //     }

    //     // --- sorting ---
    //     $sortable = [
    //         'reference'    => 'bookings.booking_reference',
    //         'guest'        => 'bookers.name',
    //         'package'      => 'packages.title',
    //         'owner'        => 'owners.name',
    //         'total_amount' => 'bookings.total_price',
    //         'status'       => 'bookings.status',
    //         'booked_at'    => 'bookings.created_at',
    //     ];
    //     if (!empty($f['sort_by']) && isset($sortable[$f['sort_by']])) {
    //         $dir = (!empty($f['sort_order']) && in_array(strtolower($f['sort_order']), ['asc','desc']))
    //             ? strtolower($f['sort_order'])
    //             : 'asc';
    //         $q->orderBy($sortable[$f['sort_by']], $dir);
    //     } else {
    //         $q->orderBy('bookings.created_at', 'desc');
    //     }

    //     return $q;
    // }

    public function filter(array $f): Builder
    {
        $q = Booking::query()
            ->leftJoin('users as bookers',   'bookings.user_id',    '=', 'bookers.id')
            ->leftJoin('packages',           'bookings.package_id', '=', 'packages.id')
            ->leftJoin('users as owners',    'packages.owner_id',   '=', 'owners.id')
            ->select('bookings.*')
            ->with(['user', 'package.owner', 'payment', 'invoice']);

        // status, date range
        if (!empty($f['status'])) {
            $q->where('bookings.status', $f['status']);
        }

        if (!empty($f['status']) && $f['status'] !== 'all') {
            $q->where('bookings.status', $f['status']);
        }

        if (!empty($f['date_from'])) {
            $q->whereDate('bookings.created_at', '>=', $f['date_from']);
        }
        if (!empty($f['date_to'])) {
            $q->whereDate('bookings.created_at', '<=', $f['date_to']);
        }

        // global search on reference, guest name, or booker name
        if (!empty($f['search'])) {
            $term = "%{$f['search']}%";
            $q->where(function($q2) use ($term) {
                $q2->where('bookings.booking_reference', 'like', $term)
                   ->orWhereRaw("CONCAT(bookings.guest_first_name,' ',bookings.guest_last_name) LIKE ?", [$term])
                   ->orWhere('bookers.name', 'like', $term);
            });
        }

        // filter by package owner
        if (!empty($f['owner_search'])) {
            $term = "%{$f['owner_search']}%";
            $q->where(function($q2) use ($term) {
                $q2->where('owners.name', 'like', $term)
                   ->orWhere('owners.business_name', 'like', $term);
            });
        }

        // sorting
        $sortable = [
            'reference'    => 'bookings.booking_reference',
            'guest'        => 'bookers.name',
            'package'      => 'packages.title',
            'owner'        => 'owners.name',
            'total_amount' => 'bookings.total_price',
            'status'       => 'bookings.status',
            'booked_at'    => 'bookings.created_at',
        ];
        if (!empty($f['sort_by']) && isset($sortable[$f['sort_by']])) {
            $dir = in_array(strtolower($f['sort_order'] ?? ''), ['asc','desc'])
                 ? strtolower($f['sort_order'])
                 : 'asc';
            $q->orderBy($sortable[$f['sort_by']], $dir);
        } else {
            $q->orderBy('bookings.created_at', 'desc');
        }

        return $q;
    }

    /**
     * Agent sees only their own packages.
     */
    public function filterForAgent(int $agentId, array $f): Builder
    {
        return $this->filter($f)
            ->where('packages.owner_id', $agentId);
    }

}