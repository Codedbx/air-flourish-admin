<?php




namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        //
        // 1) Create roles
        //
        $adminRole = Role::create(['name' => 'admin']);
        $agentRole = Role::create(['name' => 'agent']);
        $userRole  = Role::create(['name' => 'user']);

        
        $permissionsMap = [

            'platform settings' => ['view', 'edit'],

            // Packages, Activities, TimeSlots, Bookings: full CRUD in “all” vs “own”
            'packages'    => ['view all', 'view own', 'create', 'edit all', 'edit own', 'delete all', 'delete own'],
            'activities'  => ['view all', 'view own', 'create', 'edit all', 'edit own', 'delete all', 'delete own'],
            'timeslots'   => ['view all', 'view own', 'create', 'edit all', 'edit own', 'delete all', 'delete own'],
            'bookings'    => ['view all', 'view own', 'create', 'edit all', 'edit own', 'delete all', 'delete own'],

            // Payments: “view” + “process” (both “all” and “own”)
            'payments'    => ['view all', 'view own', 'process all', 'process own'],

            // Analytics: only “view analytics”
            'analytics'   => ['view'],

            // Users: (admin only)
            'users'       => ['view all', 'create', 'edit all', 'delete all'],
        ];

      
        foreach ($permissionsMap as $resource => $actions) {
            foreach ($actions as $action) {
                // Build the permission name, e.g. “view all packages”
                $permissionName = "{$action} {$resource}";
                Permission::create(['name' => $permissionName]);
            }
        }

 
        // -- Admin: gets everything
        $adminRole->givePermissionTo(Permission::all());


        $agentPermissions = [];

        // Packages (own + create)
        $agentPermissions[] = 'view own packages';
        $agentPermissions[] = 'create packages';
        $agentPermissions[] = 'edit own packages';
        $agentPermissions[] = 'delete own packages';

        // Activities (own + create)
        $agentPermissions[] = 'view own activities';
        $agentPermissions[] = 'create activities';
        $agentPermissions[] = 'edit own activities';
        $agentPermissions[] = 'delete own activities';

        // TimeSlots (own + create)
        $agentPermissions[] = 'view own timeslots';
        $agentPermissions[] = 'create timeslots';
        $agentPermissions[] = 'edit own timeslots';
        $agentPermissions[] = 'delete own timeslots';

        // Bookings (own + create)
        $agentPermissions[] = 'view own bookings';
        $agentPermissions[] = 'create bookings';
        $agentPermissions[] = 'edit own bookings';
        $agentPermissions[] = 'delete own bookings';

        // Payments (own only: view + process)
        $agentPermissions[] = 'view own payments';
        $agentPermissions[] = 'process own payments';

        // (No platform settings, no analytics, no user management)
        $agentRole->givePermissionTo($agentPermissions);

    }
}

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;
// use Spatie\Permission\Models\Permission;
// use Spatie\Permission\Models\Role;

// class RoleSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      */
//     public function run(): void
//     {
//         // Create roles
//         $adminRole = Role::create(['name' => 'admin']);
//         $agentRole = Role::create(['name' => 'agent']);
//         $userRole = Role::create(['name' => 'user']);

//         // Create permissions
//         $permissions = [
//             // Platform settings
//             'view platform settings',
//             'edit platform settings',
            
//             // Packages
//             'view packages',
//             'create packages',
//             'edit packages',
//             'delete packages',
            
//             // Activities
//             'view activities',
//             'create activities',
//             'edit activities',
//             'delete activities',
            
//             // Bookings
//             'view bookings',
//             'create bookings',
//             'edit bookings',
//             'delete bookings',
            
//             // Payments
//             'view payments',
//             'process payments',
//         ];

//         foreach ($permissions as $permission) {
//             Permission::create(['name' => $permission]);
//         }

//         // Assign permissions to roles
//         $adminRole->givePermissionTo(Permission::all());
        
//         $agentRole->givePermissionTo([
//             'view packages',
//             'create packages',
//             'edit packages',
//             'delete packages',
//             'view activities',
//             'create activities',
//             'edit activities',
//             'delete activities',
//             'view bookings',
//         ]);
        
//         // $userRole->givePermissionTo([
//         //     'view packages',
//         //     'view activities',
//         //     'view bookings',
//         //     'create bookings',
//         // ]);
//     }
// }

