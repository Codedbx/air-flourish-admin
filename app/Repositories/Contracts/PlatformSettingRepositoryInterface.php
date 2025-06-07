<?php

namespace App\Repositories\Contracts;

use App\Models\PlatformSetting;

interface PlatformSettingRepositoryInterface
{
    
    public function getSettings(): PlatformSetting;

    public function updateSettings(array $data): PlatformSetting;
}