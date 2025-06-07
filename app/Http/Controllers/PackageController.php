<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackageResource;
use App\Models\Activity;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function __construct(
        private PackageService $packageService
    ) {
    }

    /**
     * Display a listing of the packages.
     */
    public function index(Request $request)
    {
        $incoming = $request->only([
            'search',
            'destination',
            'price_min',
            'price_max',
            'date_start',
            'date_end',
            'activities',
            'sort',
            'direction',
        ]);

        $defaults = [
            'search'      => '',
            'destination' => '',
            'price_min'   => '',
            'price_max'   => '',
            'date_start'  => '',
            'date_end'    => '',
            'activities'  => '',
            'sort'        => 'id',
            'direction'   => 'desc',
        ];

        $filters = array_merge($defaults, $incoming);
        $packages = $this->packageService->getFilteredPackages($filters);


        // Log::info('Filtered packages:', $packages->toArray());

        return Inertia::render("packages/index", [
            'packages' => $packages,
            'filters'  => $filters,
        ]);
    }

    /**
     * Show the form for creating a new package.
     */
    public function create()
    {
        $activities = Activity::all();

        
        return Inertia::render('packages/createPackage', [
            'activities' => $activities,
            'flash' => [
            'success' => session('success'),
        ],
        ]);
    }

    
    public function store(StorePackageRequest $request)
    {
        $validated = $request->validated();
        $package = $this->packageService->createPackage($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $package->addMedia($image)->toMediaCollection('package_images');
            }
        }

        return redirect()->route('packages.index')
                         ->with('success', 'Package created successfully.');
    }

    public function edit(Package $package)
    {
        $package->load('activities');

        $allActivities = Activity::all(['id', 'title', 'price']);
        $images = $package->getMedia('package_images')->map(fn($m) => [
            'id'        => $m->id,
            'url'       => $m->getUrl(),
            'thumbnail' => $m->getUrl('thumb'),
        ]);

        return Inertia::render('packages/editPackage', [
            'package'       => $package,
            'allActivities' => $allActivities,
            'images'        => $images,
            'flash' => [
            'success' => session('success'),
        ],
        ]);
    }

    public function update(UpdatePackageRequest $request, Package $package)
    {
        $validated = $request->all();

        
        $updated   = $this->packageService->updatePackage($package->id, $validated);

        // Handle newly‐uploaded images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $updated->addMedia($image)->toMediaCollection('package_images');
            }
        }

        // Handle deletions
        if (!empty($validated['delete_media']) && is_array($validated['delete_media'])) {
            foreach ($validated['delete_media'] as $mediaId) {
                $media = $updated->media()->find($mediaId);
                if ($media) {
                    $media->delete();
                }
            }
        }

        return redirect()->route('packages.index')
                         ->with('success', 'Package updated successfully.');
    }

    

   

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        $package->load(['activities.timeSlots', 'owner']);
        
        return Inertia::render('Packages/Show', [
            'package' => $package,
            'images' => $package->getMedia('package_images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail' => $media->getUrl('thumb'),
                ];
            }),
        ]);
    }



    public function destroy(Package $package)
    {
        $this->packageService->deletePackage($package->id);
        return redirect()->route('packages.index')
                         ->with('success', 'Package deleted successfully.');
    }

   

    /**
     * Toggle the featured status of a package.
     */
    public function toggleFeatured(Package $package)
    {
        // $this->authorize('update', $package);
        
        $package->is_featured = !$package->is_featured;
        $package->save();
        
        return back()->with('success', 'Package featured status updated.');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggleActive(Package $package)
    {
        // $this->authorize('update', $package);
        
        $package->is_active = !$package->is_active;
        $package->save();
        
        return back()->with('success', 'Package active status updated.');
    }
}
