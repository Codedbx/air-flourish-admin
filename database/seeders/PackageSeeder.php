<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $agentRole = Role::firstOrCreate(['name' => 'agent']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $admin->assignRole($adminRole);

        // Create agent users
        $agents = User::factory(5)->create();
        foreach ($agents as $agent) {
            $agent->assignRole($agentRole);
        }

        // Create regular users
        $users = User::factory(10)->create();
        foreach ($users as $user) {
            $user->assignRole($userRole);
        }

        // Create packages for agents
        foreach ($agents as $agent) {
            Package::factory(3)
                ->withActivities(rand(2, 5))
                ->create(['owner_id' => $agent->id]);
        }

        // Create some admin packages
        Package::factory(15)
            ->withActivities(rand(3, 6))
            ->create(['owner_id' => $admin->id]);
    
    }
}
