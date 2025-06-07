<?php

namespace App\Repositories;

use App\Models\Package;
use App\Repositories\Contracts\PackageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class PackageRepository implements PackageRepositoryInterface
{
    public function all()
    {
        return Package::with(['activities.timeSlots', 'owner'])->get();
    }

    public function find(int $id): ?Package
    {
        $package = Package::with(['media','activities.timeSlots', 'owner'])
                        ->find($id);

        Log::info('PackageRepository@find', [
            'id'      => $id,
            'package' => $package,
        ]);

        return $package;
    }


    public function create(array $data): Package
    {
        return Package::create($data);
    }

    public function update(int $id, array $data): Package
    {
        $package = Package::findOrFail($id);
        $package->update($data);
        return $package->fresh();
    }

    public function delete(int $id): bool
    {
        return Package::destroy($id) > 0;
    }

    public function getByOwner(int $ownerId)
    {
        return Package::where('owner_id', $ownerId)
            ->with(['media', 'activities.timeSlots'])
            ->get();
    }

    // public function filter(array $filters): LengthAwarePaginator
    // {
    //     $query = Package::with(['media','activities.timeSlots', 'owner'])
    //                     ->visible()
    //                     ->inRandomOrder();

    //     if (!empty($filters['destination'])) {
    //         $query->where('location', 'like', '%' . $filters['destination'] . '%');
    //     }

    //     if (!empty($filters['search'])) {
    //         $query->where('title', 'like', '%' . $filters['search'] . '%');
    //     }

    //     if (
    //         array_key_exists('price_min', $filters) && $filters['price_min'] !== '' 
    //      || array_key_exists('price_max', $filters) && $filters['price_max'] !== ''
    //     ) {
    //         $min = $filters['price_min'] !== '' ? $filters['price_min'] : 0;
    //         $max = $filters['price_max'] !== '' ? $filters['price_max'] : PHP_INT_MAX;
    //         $query->whereBetween('base_price', [$min, $max]);
    //     }

    //     if (!empty($filters['check_in_start'])) {
    //         if (!empty($filters['check_in_end'])) {
    //             // Range filter
    //             $query->whereBetween('hotel_checkin', [
    //                 $filters['check_in_start'], 
    //                 $filters['check_in_end']
    //             ]);
    //         } else {
    //             // Single date filter
    //             $query->whereDate('hotel_checkin', $filters['check_in_start']);
    //         }
    //     }

    //     if (!empty($filters['hotel_rating'])) {
    //         $query->where('hotel_star_rating', $filters['hotel_rating']);
    //     }


    //     if (!empty($filters['activities']) && is_array($filters['activities'])) {
    //         $query->whereHas('activities', function ($q) use ($filters) {
    //             $q->whereIn('id', $filters['activities']);
    //         });
    //     }

    //     if (!empty($filters['date_start']) && !empty($filters['date_end'])) {
    //         $query->where('booking_start_date', '<=', $filters['date_end'])
    //               ->where('booking_end_date', '>=',   $filters['date_start']);
    //     }

    //     $sortBy  = $filters['sort']      ?? 'id';
    //     $sortDir = $filters['direction'] ?? 'desc';
    //     $query->orderBy($sortBy, $sortDir);

    //     $perPage = $filters['per_page'] ?? 5;
    //     return $query->paginate($perPage);
    // }

     public function filter(array $filters): LengthAwarePaginator
    {
        // 1) Build base query with all filters EXCEPT ordering/pagination
        $query = Package::with(['media','activities.timeSlots', 'owner'])
                        ->visible();

        // destination, search, price…
        if (!empty($filters['destination'])) {
            $query->where('location', 'like', '%' . $filters['destination'] . '%');
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (
            array_key_exists('price_min', $filters) && $filters['price_min'] !== ''
         || array_key_exists('price_max', $filters) && $filters['price_max'] !== ''
        ) {
            $min = $filters['price_min'] !== '' ? $filters['price_min'] : 0;
            $max = $filters['price_max'] !== '' ? $filters['price_max'] : PHP_INT_MAX;
            $query->whereBetween('base_price', [$min, $max]);
        }

        // check-in single or range
        if (!empty($filters['check_in_start'])) {
            if (!empty($filters['check_in_end'])) {
                $query->whereBetween('hotel_checkin', [
                    $filters['check_in_start'],
                    $filters['check_in_end'],
                ]);
            } else {
                $query->whereDate('hotel_checkin', $filters['check_in_start']);
            }
        }

        // hotel star rating
        if (!empty($filters['hotel_rating'])) {
            $query->where('hotel_star_rating', $filters['hotel_rating']);
        }

        // activities
        if (!empty($filters['activities']) && is_array($filters['activities'])) {
            $query->whereHas('activities', function ($q) use ($filters) {
                $q->whereIn('id', $filters['activities']);
            });
        }

        // booking date window
        if (!empty($filters['date_start']) && !empty($filters['date_end'])) {
            $query->where('booking_start_date', '<=', $filters['date_end'])
                  ->where('booking_end_date', '>=', $filters['date_start']);
        }

        // 2) Count total for pagination UI
        $total = $query->count();

        // 3) Calculate per-page & featured count
        $perPage       = $filters['per_page'] ?? 5;
        $page          = $filters['page']     ?? 1;
        $featuredCount = round($perPage * 0.3);

        // 4) Get featured & non-featured sets
        $featured = (clone $query)
            ->where('is_featured', true)
            ->inRandomOrder()
            ->limit($featuredCount)
            ->get();

        $remaining = $perPage - $featured->count();

        $nonFeatured = (clone $query)
            ->where('is_featured', false)
            ->inRandomOrder()
            ->limit($remaining)
            ->get();

        // 5) Merge & shuffle for final page
        $items = $featured->merge($nonFeatured)->shuffle();

        // 6) Build a LengthAwarePaginator
        return new LengthAwarePaginator(
            $items,
            $total,
            $perPage,
            $page,
            [
                'path'  => LengthAwarePaginator::resolveCurrentPath(),
                'query' => request()->query(), // preserve other query params
            ]
        );
    }

    public function getRandomFeatured(int $limit = 10): Collection
    {
        return Package::with(['media','activities.timeSlots','owner'])
            ->visible()
            ->randomFeatured()    
            ->limit($limit)       
            ->get();
    }

}