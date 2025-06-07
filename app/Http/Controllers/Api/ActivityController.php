<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActivityRequest;
use App\Models\Package;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
     public function __construct(
        private ActivityService $activityService
    ) {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin|agent')->except(['index', 'show']);
    }

    public function index(int $packageId): JsonResponse
    {
        $activities = $this->activityService->getActivitiesByPackage($packageId);

        return response()->json([
            'status' => 'success',
            'data' => $activities,
        ]);
    }

    public function store(StoreActivityRequest $request, int $packageId): JsonResponse
    {
        $package = Package::findOrFail($packageId);
        
        // Check ownership
        if (auth()->user()->hasRole('agent') && $package->owner_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $data = array_merge($request->validated(), ['package_id' => $packageId]);
        $activity = $this->activityService->createActivity($data);

        // Handle media uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $activity->addMediaFromRequest('images')
                    ->each(function ($fileAdder) {
                        $fileAdder->toMediaCollection('images');
                    });
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Activity created successfully',
            'data' => $activity->load(['package', 'media']),
        ], 201);
    }

    public function show(int $packageId, int $id): JsonResponse
    {
        $activity = $this->activityService->getActivity($id);

        if (!$activity || $activity->package_id !== $packageId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Activity not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $activity->load(['package', 'media']),
        ]);
    }

    public function update(Request $request, int $packageId, int $id): JsonResponse
    {
        $activity = $this->activityService->getActivity($id);
        
        if (!$activity || $activity->package_id !== $packageId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Activity not found',
            ], 404);
        }

        // Check ownership
        if (auth()->user()->hasRole('agent') && $activity->package->owner_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $activity = $this->activityService->updateActivity($id, $request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Activity updated successfully',
            'data' => $activity->load(['package', 'media']),
        ]);
    }

    public function destroy(int $packageId, int $id): JsonResponse
    {
        $activity = $this->activityService->getActivity($id);
        
        if (!$activity || $activity->package_id !== $packageId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Activity not found',
            ], 404);
        }

        // Check ownership
        if (auth()->user()->hasRole('agent') && $activity->package->owner_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $deleted = $this->activityService->deleteActivity($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Activity deleted successfully',
        ]);
    }
}
