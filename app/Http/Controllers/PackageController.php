<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackageResource;
use App\Models\Activity;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PackageController extends Controller
{

    use AuthorizesRequests, ValidatesRequests;
    public function __construct(
        private PackageService $packageService
    ) {

        // $this->authorizeResource(Package::class, 'package');
    }

    /**
     * Display a listing of the packages.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Package::class);
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
            'owner_id'
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
            'owner_id'  => ''
        ];

        $filters = array_merge($defaults, $incoming);

        $user = Auth::user();

        // Apply own/all permission logic
        if (Gate::allows('view all packages')) {
            $packages = $this->packageService->getFilteredPackages($filters);
        } elseif (Gate::allows('view own packages')) {
            $filters['owner_id'] = $user->id;
            $packages = $this->packageService->getFilteredPackages($filters);
        } else {
            abort(403);
        }

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
        $this->authorize('create', Package::class);

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
        $this->authorize('create', Package::class);
        
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
        $this->authorize('view', $package);

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
        $this->authorize('view', $package);
        
        $validated = $request->validated();

        $updated = $this->packageService->updatePackage($package->id, $validated);

        $existingCount = $updated->getMedia('package_images')->count();
        $toDelete      = $validated['deleted_image_ids'] ?? [];
        $remaining     = $existingCount - count($toDelete);
        $newCount      = $request->hasFile('images')
                          ? count($request->file('images'))
                          : 0;
        $total = $remaining + $newCount;


        if ($total < 4 || $total > 5) {
            return back()->withErrors([
                'images' => 'A package must have between 4 and 5 images in total (after deletions and uploads).',
            ])->withInput();
        }


        Log::info('total images', ['image count' => $total,
        'existing images count' => $existingCount,
        'toDelete count' => $toDelete,
        'remaing count' => $remaining,
        'new images count' => $newCount,
    ]);


        foreach ($toDelete as $mediaId) {
            if ($media = $updated->media()->find($mediaId)) {
                $media->delete();
            }
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $updated->addMedia($image)
                        ->toMediaCollection('package_images');
            }
        }

        return redirect()
            ->route('packages.index')
            ->with('success', 'Package updated successfully.');
    }

    

   

    /**
     * Display the specified package.
     */
    public function show(Package $package)
    {
        $this->authorize('view', $package);

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
        $this->authorize('delete', $package);

        $this->packageService->deletePackage($package->id);
        return redirect()->route('packages.index')
                         ->with('success', 'Package deleted successfully.');
    }

   

    /**
     * Toggle the featured status of a package.
     */
    public function toggleFeatured(Package $package)
    {
        $this->authorize('update', $package);
        
        $package->is_featured = !$package->is_featured;
        $package->save();
        
        return back()->with('success', 'Package featured status updated.');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggleActive(Package $package)
    {
        $this->authorize('update', $package);
        
        $package->is_active = !$package->is_active;
        $package->save();
        
        return back()->with('success', 'Package active status updated.');
    }

    public function deletePackageImage(Package $package, Media $media)
    {
        $this->authorize('update', $package);

        $media->delete(); 

        // Return the updated media collection to the frontend
        $remaining = $package->getMedia('package_images')->map(function($m) {
            return [
                'id'        => $m->id,
                'url'       => $m->getUrl(),
                'thumbnail' => $m->getUrl('thumb'),
            ];
        });

        return response()->json([
            'media' => $remaining,
        ], 200);
    }
}
