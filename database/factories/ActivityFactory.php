<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('+1 week', '+1 month');
        $endTime = $this->faker->dateTimeBetween($startTime, $startTime->format('Y-m-d') . ' +6 hours');

        return [
            'package_id' => Package::factory(),
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->address(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'price' => $this->faker->randomFloat(2, 50, 500),
        ];
    }
}
