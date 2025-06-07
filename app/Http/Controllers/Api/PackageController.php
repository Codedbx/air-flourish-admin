<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Http\Resources\PackageResource;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PackageController extends Controller
{
    public function __construct(
        private PackageService $packageService
    ) {
        // $this->middleware('auth:sanctum');
        // $this->middleware('role:admin|agent')->except(['index', 'show']);
    }

     public function index(Request $request): JsonResponse
    {
        // Capture all possible filters from the request, including 'per_page'
        $filters = $request->only([
            'search',
            'destination',
            'price_min',
            'price_max',
            'date_start',
            'date_end',
            'check_in_start',
            'check_in_end',
            'activities',
            'sort',
            'direction',
            'per_page', 
            'page',  
            'hotel_rating',   
        ]);

        Log::info('Package filters:', $filters);

        $packages = $this->packageService->getFilteredPackages($filters);

        // Check if no packages were found after filtering
        if ($packages->isEmpty() && $packages->total() === 0) { // Check total for true emptiness, as isEmpty() can be true even with a total if it's the last page
            return response()->json([
                'status'  => 'error',
                'message' => 'No packages found matching your criteria.', // More specific message
            ], 404);
        }


        return PackageResource::collection($packages)->response()->setStatusCode(200);
        
    }

     public function randomFeatured(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        $packages = $this->packageService->getRandomFeaturedPackages($limit);

        return response()->json([
            'status' => 'success',
            'data'   => PackageResource::collection($packages),
        ], 200);
    }

     public function store(StorePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->createPackage($request->validated());

        return response()->json([
            'status' => 'success',
            'data' => new PackageResource($package),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $package = $this->packageService->getPackage($id);

        Log::info('Fetching package', ['id' => $id]);
        Log::info('Package details', ['package' => $package]);

        if (!$package) {
            return response()->json([
                'status' => 'error',
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => new PackageResource($package),
        ]);
    }



  public function userPackages(Request $request): JsonResponse
   {
    // Validate that user_id is provided and is numeric
    $request->validate([
        'userId' => 'required|integer|exists:users,id'
    ]);


    $packages = $this->packageService->getUserPackages($request->userId);

    return response()->json([
        'status' => 'success',
        'data' => PackageResource::collection($packages),
    ]);
   }

}