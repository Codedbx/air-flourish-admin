<?php




namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePlatformSettingRequest;
use App\Models\PlatformSetting;
use App\Services\PlatformSettingService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlatformSettingController extends Controller
{

    use AuthorizesRequests;
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
        $this->authorize('viewAny', PlatformSetting::class);

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
        $this->authorize('create', PlatformSetting::class);

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
}