<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlatformSettings\UpdatePlatformSettingRequest;
use App\Http\Requests\UpdatePlatformSettingRequest as RequestsUpdatePlatformSettingRequest;
use App\Services\PlatformSettingService;
use Illuminate\Http\JsonResponse;

class PlatformSettingController extends Controller
{
    /**
     * @var PlatformSettingService
     */
    protected $platformSettingService;

    /**
     * PlatformSettingController constructor.
     *
     * @param PlatformSettingService $platformSettingService
     */
    public function __construct(PlatformSettingService $platformSettingService)
    {
        $this->platformSettingService = $platformSettingService;
        // $this->middleware('auth:sanctum');
        // $this->middleware('role:admin');
    }

    /**
     * Get the platform settings.
     *
     * @return JsonResponse
     */
    public function getSettings(): JsonResponse
    {
        $settings = $this->platformSettingService->getSettings();

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }

    /**
     * Update the platform settings.
     *
     * @param UpdatePlatformSettingRequest $request
     * @return JsonResponse
     */
    public function updateSettings(RequestsUpdatePlatformSettingRequest $request): JsonResponse
    {
        $settings = $this->platformSettingService->updateSettings($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Platform settings updated successfully',
            'data' => $settings,
        ]);
    }
}