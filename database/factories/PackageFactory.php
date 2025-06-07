<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    protected $model = Package::class;

    public function definition(): array
    {
        // Use Carbon for more reliable date manipulation
        $now = now();
        
        // Check-in: 1-10 days from now
        $checkInTime = $now->copy()->addDays(1);
        
        // Check-out: 1-20 days after check-in
        $checkOutTime = $checkInTime->copy()->addDays(5);
        
        // Booking start: now to 1 month from now
        $bookingStartDate = $now->copy()->addDays(1);
        
        // Booking end: 1-60 days after booking start
        $bookingEndDate = $bookingStartDate->copy()->addDays(5);

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraphs(3, true),
            'base_price' => $this->faker->randomFloat(2, 100, 5000),
            'agent_addon_price' => $this->faker->randomFloat(2, 10, 500),
            'agent_price_type' => $this->faker->randomElement(['fixed', 'percentage']),
            // 'check_in_time' => $checkInTime,
            // 'check_out_time' => $checkOutTime,
            // 'booking_start_date' => $bookingStartDate,
            // 'booking_end_date' => $bookingEndDate,
            'check_in_time' => '2025-06-01 14:00:00',
            'check_out_time' => '2025-06-10 11:00:00',
            'booking_start_date' => '2025-05-01 00:00:00',
            'booking_end_date' => '2025-05-31 23:59:59',
            'is_active' => $this->faker->boolean(90),
            'is_featured' => $this->faker->boolean(50),
            'is_refundable' => $this->faker->boolean(70),
            'terms_and_conditions' => $this->faker->text(200),
            'cancellation_policy' => $this->faker->text(200),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'owner_id' => User::factory(),
            'visibility' => $this->faker->randomElement(['public', 'private']),
        ];
    }

    public function withActivities(int $count = 3): static
    {
        return $this->afterCreating(function (Package $package) use ($count) {
            $package->activities()->createMany(
                Activity::factory($count)->make()->toArray()
            );
        });
    }

    // public function withAddon(): static
    // {
    //     return $this->afterCreating(function (Package $package) {
    //         $package->addon()->create([
    //             'type' => $this->faker->randomElement(['fixed', 'percentage']),
    //             'amount' => $this->faker->randomFloat(2, 10, 100),
    //         ]);
    //     });
    // }
}