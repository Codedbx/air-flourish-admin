<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Package;
use App\Models\PlatformSetting;
use App\Repositories\PackageRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PackageService
{
    public function __construct(
        private PackageRepository $packageRepository
    ) {}

    public function getAllPackages()
    {
        return $this->packageRepository->all();
    }

    public function getPackage(int $id): ?Package
    {
        return $this->packageRepository->find($id);
    }

    
    public function createPackage(array $data): Package
    {
        return DB::transaction(function () use ($data) {
            $data['owner_id'] = Auth::id();

            // Compute totals now:
            $calculated = $this->calculateTotals($data);
            $data = array_merge($data, $calculated);

            $package = $this->packageRepository->create($data);

            // Sync activities if provided
            if (!empty($data['activities']) && is_array($data['activities'])) {
                $package->activities()->sync($data['activities']);
            }

            return $package->load(['activities', 'media']);
        });
    }

    /**
     * When updating, recalc only if base_price or activities change.
     */
    public function updatePackage(int $id, array $data): Package
    {
        return DB::transaction(function () use ($id, $data) {
            $original = $this->packageRepository->find($id);
            if (! $original) {
                throw new \Exception("Package not found");
            }

            $needsRecalc = false;

            // 1) Did base_price change?
            if (isset($data['base_price']) && $data['base_price'] != $original->base_price) {
                $needsRecalc = true;
            }

            // 2) Did activities change? (compare sorted arrays of IDs)
            if (
                isset($data['activities']) &&
                is_array($data['activities'])
            ) {
                $origIds = $original->activities->pluck('id')->sort()->values()->toArray();
                $newIds  = collect($data['activities'])->map(fn($x) => (int)$x)->sort()->values()->toArray();
                if ($origIds !== $newIds) {
                    $needsRecalc = true;
                }
            }

            // Recalculate totals if needed
            if ($needsRecalc) {
                $calculated = $this->calculateTotals($data);
                $data = array_merge($data, $calculated);
            }

            // Update the package record
            $updated = $this->packageRepository->update($id, $data);

            // Sync activities if provided
            if (!empty($data['activities']) && is_array($data['activities'])) {
                $updated->activities()->sync($data['activities']);
            }

            return $updated->load(['activities', 'media']);
        });
    }


    

    public function deletePackage($id): bool
    {
        return $this->packageRepository->delete($id);
    }

    public function getFilteredPackages(array $filters)
    {
        return $this->packageRepository->filter($filters);
    }

    public function getUserPackages($id)
    {
        return $this->packageRepository->getByOwner($id);
    }
          
     public function getRandomFeaturedPackages(int $limit = 10): Collection
    {
        return $this->packageRepository->getRandomFeatured($limit);
    }
    



    
    private function calculateTotals(array $data): array
    {
        // 1) Sum up activity prices
        $activityTotal = 0.0;
        if (!empty($data['activities']) && is_array($data['activities'])) {
            $prices = Activity::whereIn('id', $data['activities'])
                        ->pluck('price')
                        ->map(fn($p) => (float)$p)
                        ->toArray();
            $activityTotal = array_sum($prices);
        }

        $base = isset($data['base_price']) ? (float)$data['base_price'] : 0.0;

        $adminAddonPrice = 0.0;
        $adminPriceType  = 'fixed';

        if ($adminPriceType === 'percentage') {
            $adminAddonPrice = ($base + $activityTotal) * ($adminAddonPrice / 100);
        }

        // 4) Agent addon
        $agentAddon = (float) ($data['agent_addon_price'] ?? 0.0);
        $agentAddonPrice = 0.0;
        if (($data['agent_price_type'] ?? 'fixed') === 'percentage') {
            $agentAddonPrice = ($base + $activityTotal) * ($agentAddon / 100);
        } else {
            $agentAddonPrice = $agentAddon;
        }

        // 5) Final total: base + activityTotal + adminAddonPrice + agentAddonPrice
        $total = $base + $activityTotal + $adminAddonPrice + $agentAddonPrice;

        return [
            'total_activities_price' => round($activityTotal, 2),
            'admin_addon_price'      => round($adminAddonPrice, 2),
            'admin_price_type'       => $adminPriceType,
            'agent_addon_price'      => round($agentAddonPrice, 2),
            'agent_price_type'       => $data['agent_price_type'] ?? 'fixed',
            'total_price'            => round($total, 2),
        ];
    }

}
