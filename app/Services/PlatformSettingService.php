<?php

// namespace App\Services;

// use App\Models\PlatformSetting;
// use App\Repositories\PlatformSettingRepository;
// // use App\Services\Interfaces\PlatformSettingServiceInterface;

// class PlatformSettingService 
// {
//     /**
//      * @var PlatformSettingRepository
//      */
//     protected $platformSettingRepository;

//     /**
//      * PlatformSettingService constructor.
//      *
//      * @param PlatformSettingRepositoryInterface $platformSettingRepository
//      */
//     public function __construct(PlatformSettingRepository $platformSettingRepository)
//     {
//         $this->platformSettingRepository = $platformSettingRepository;
//     }

//     /**
//      * Get the platform settings.
//      *
//      * @return PlatformSetting
//      */
//     public function getSettings(): PlatformSetting
//     {
//         return $this->platformSettingRepository->getSettings();
//     }

//     /**
//      * Update the platform settings.
//      *
//      * @param array $data
//      * @return PlatformSetting
//      */
//     public function updateSettings(array $data): PlatformSetting
//     {
//         return $this->platformSettingRepository->updateSettings($data);
//     }

//     /**
//      * Calculate the admin addon amount based on the price.
//      *
//      * @param float $price
//      * @return float
//      */
//     public function calculateAdminAddonAmount(float $price): float
//     {
//         $settings = $this->getSettings();

//         if ($settings->admin_addon_type === 'fixed') {
//             return $settings->admin_addon_amount;
//         } else {
//             return $price * ($settings->admin_addon_amount / 100);
//         }
//     }
// }



namespace App\Services;

use App\Models\PlatformSetting;
use Illuminate\Database\Eloquent\Model;

class PlatformSettingService
{
    /**
     * Get platform settings.
     * Creates default settings if none exist.
     *
     * @return PlatformSetting
     */
    public function getSettings(): PlatformSetting
    {
        $settings = PlatformSetting::first();

        if (!$settings) {
            // Return new instance with default values but don't save yet
            $settings = new PlatformSetting([
                'admin_addon_type' => 'percentage',
                'admin_addon_amount' => '5.00',
                'espees_rate' => '1.00',
                'naira_rate' => '1500.00',
            ]);
        }

        return $settings;
    }

    /**
     * Update platform settings.
     *
     * @param array $data
     * @return PlatformSetting
     */
    public function updateSettings(array $data): PlatformSetting
    {
        $settings = PlatformSetting::first();

        if (!$settings) {
            $settings = new PlatformSetting();
        }

        $settings->fill([
            'admin_addon_type' => $data['admin_addon_type'],
            'admin_addon_amount' => $data['admin_addon_amount'],
            'espees_rate' => $data['espees_rate'],
            'naira_rate' => $data['naira_rate'],
        ]);

        $settings->save();

        return $settings->fresh();
    }

    /**
     * Create default platform settings.
     *
     * @return PlatformSetting
     */
    private function createDefaultSettings(): PlatformSetting
    {
        return PlatformSetting::create([
            'admin_addon_type' => 'percentage',
            'admin_addon_amount' => '5.00',
            'espees_rate' => '1.00',
            'naira_rate' => '1500.00',
        ]);
    }

    /**
     * Calculate admin addon for a given amount.
     *
     * @param float $amount
     * @return float
     */
    public function calculateAdminAddon(float $amount): float
    {
        $settings = $this->getSettings();

        if ($settings->admin_addon_type === 'percentage') {
            return ($amount * $settings->admin_addon_amount) / 100;
        }

        return (float) $settings->admin_addon_amount;
    }

    /**
     * Convert espees to naira.
     *
     * @param float $espees
     * @return float
     */
    public function convertEspeesToNaira(float $espees): float
    {
        $settings = $this->getSettings();
        return $espees * $settings->espees_rate;
    }

    /**
     * Convert USD to naira.
     *
     * @param float $usd
     * @return float
     */
    public function convertUsdToNaira(float $usd): float
    {
        $settings = $this->getSettings();
        return $usd * $settings->naira_rate;
    }

    /**
     * Get formatted settings for display.
     *
     * @return array
     */
    public function getFormattedSettings(): array
    {
        $settings = $this->getSettings();

        return [
            'admin_addon_display' => $settings->admin_addon_type === 'percentage' 
                ? $settings->admin_addon_amount . '%'
                : '₦' . number_format($settings->admin_addon_amount, 2),
            'espees_rate_display' => '₦' . number_format($settings->espees_rate, 2),
            'naira_rate_display' => '₦' . number_format($settings->naira_rate, 2),
            'raw_settings' => $settings->toArray(),
        ];
    }
}