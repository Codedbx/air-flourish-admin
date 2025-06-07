<?php




namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePlatformSettingRequest;
use App\Services\PlatformSettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

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
    }

    /**
     * Show the platform settings form.
     *
     * @return Response
     */
    public function edit(): Response
    {
        $settings = $this->platformSettingService->getSettings();
        $hasExistingSettings = $settings->exists;

        return Inertia::render('settings/platformSettings', [
            'settings' => $settings,
            'hasExistingSettings' => $hasExistingSettings,
        ]);
    }

    /**
     * Update the platform settings.
     *
     * @param UpdatePlatformSettingRequest $request
     * @return RedirectResponse
     */
    public function update(UpdatePlatformSettingRequest $request): RedirectResponse
    {
        try {
            $settings = $this->platformSettingService->updateSettings($request->validated());

            return redirect()
                ->route('settings.platform')
                ->with('success', 'Platform settings updated successfully');
        } catch (\Exception $e) {
            return redirect()
                ->route('settings.platform')
                ->with('error', 'Failed to update platform settings. Please try again.');
        }
    }

    /**
     * Get the platform settings (API endpoint).
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
     * Update the platform settings (API endpoint).
     *
     * @param UpdatePlatformSettingRequest $request
     * @return JsonResponse
     */
    public function updateSettings(UpdatePlatformSettingRequest $request): JsonResponse
    {
        $settings = $this->platformSettingService->updateSettings($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Platform settings updated successfully',
            'data' => $settings,
        ]);
    }
}