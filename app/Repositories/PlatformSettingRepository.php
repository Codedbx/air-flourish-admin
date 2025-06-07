<?php

namespace App\Repositories;

use App\Models\PlatformSetting;
use App\Repositories\Contracts\PlatformSettingRepositoryInterface;

class PlatformSettingRepository implements PlatformSettingRepositoryInterface
{
    /**
     * Get the platform settings.
     *
     * @return PlatformSetting
     */
    public function getSettings(): PlatformSetting
    {
        return PlatformSetting::first() ?? new PlatformSetting();
    }

    /**
     * Update the platform settings.
     *
     * @param array $data
     * @return PlatformSetting
     */
    public function updateSettings(array $data): PlatformSetting
    {
        $settings = $this->getSettings();
        
        if ($settings->exists) {
            $settings->update($data);
        } else {
            $settings = PlatformSetting::create($data);
        }

        return $settings;
    }
}