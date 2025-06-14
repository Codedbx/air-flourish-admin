<?php




namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        if (DB::table('permissions')->count()) {
            Schema::disableForeignKeyConstraints();
            DB::table('role_has_permissions')->truncate();
            DB::table('model_has_roles')->truncate();
            DB::table('model_has_permissions')->truncate();
            Permission::truncate();
            Role::truncate();
            Schema::enableForeignKeyConstraints();
        }
        
        $adminRole = Role::create(['name' => 'admin']);
        $agentRole = Role::create(['name' => 'agent']);
        $userRole  = Role::create(['name' => 'user']);

        
         $permissionsMap = [

            // Must have dashboard access first
            'dashboard'         => ['access'],

            // Platform Settings
            'platform settings' => ['view', 'edit'],

            // Packages, Activities, TimeSlots, Bookings
            'packages'    => ['view all','view own','create','edit all','edit own','delete all','delete own'],
            'activities'  => ['view all','view own','create','edit all','edit own','delete all','delete own'],
            'timeslots'   => ['view all','view own','create','edit all','edit own','delete all','delete own'],
            'bookings'    => ['view all','view own','create','edit all','edit own','delete all','delete own'],
            'coupons'     => ['view all','view own','create','edit all','edit own','delete all','delete own'],

            'roles'     => ['view','create','edit','delete'],


            // Payments
            'payments'    => ['view all','view own','process all','process own'],

            // Analytics
            'analytics'   => ['view all','view own'],

            // Users (admin only)
            'users'       => ['view all','create','edit all','delete all'],
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


        $agentPermissions = [
            // dashboard
            'access dashboard',

            // packages
            'view own packages','create packages','edit own packages','delete own packages',
            // activities
            'view own activities','create activities','edit own activities','delete own activities',
            // timeslots
            'view own timeslots','create timeslots','edit own timeslots','delete own timeslots',
            // bookings
            'view own bookings','create bookings','edit own bookings','delete own bookings',
            //coupons 
            'view own coupons','create coupons','edit own coupons','delete own coupons',
            // payments
            'view own payments','process own payments',
            // analytics
            'view own analytics',
        ];

        // (No platform settings, no analytics, no user management)
        $agentRole->givePermissionTo($agentPermissions);


        $adminUser = User::create([
            'name'     => 'Admin User',
            'email'    => 'joshua@admin.com',
            'password' => Hash::make('password123'), 
        ]);

        $adminUser->assignRole($adminRole);

    }
}
