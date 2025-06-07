<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function __construct()
    {
        // Optional: $this->middleware('auth');
        // Optional: $this->middleware('can:manage roles');
    }

    /**
     * Show paginated list of roles.
     */
    public function index(Request $request): Response
    {
        $query = Role::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }
        if ($request->filled('sort')) {
            $order = $request->get('order', 'asc');
            $query->orderBy($request->sort, $order);
        }

        $query->withCount(['permissions', 'users']);

        $roles = $query
            ->paginate(10)
            ->through(fn(Role $role) => [
                'id'                => $role->id,
                'name'              => $role->name,
                'guard_name'        => $role->guard_name,
                'permissions_count' => $role->permissions_count,
                'users_count'       => $role->users_count,
            ]);

        return Inertia::render('roles/index', [
            'roles'   => $roles,
            'filters' => [
                'search' => $request->search,
                'sort'   => $request->sort,
                'order'  => $request->order,
            ],
        ]);
    }

    /**
     * Show form to create a new role (flat list of permissions).
     */
    public function create(): Response
    {
        $permissions = Permission::all(); // <- no grouping
        return Inertia::render('roles/createRoles', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name'         => 'required|string|max:255|unique:roles,name',
            'guard_name'   => 'required|string|in:web,api',
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ])->validate();

        Log::info('Creating role', $validated);

        $role = Role::create([
            'name'       => $validated['name'],
            'guard_name' => $validated['guard_name'],
        ]);

        if (! empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Show form to edit an existing role.
     */
    public function edit(Role $role): Response
    {
        $permissions     = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return Inertia::render('roles/editRole', [
            'role'            => $role,
            'permissions'     => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    /**
     * Update an existing role.
     */
    public function update(Request $request, Role $role)
    {
        $validated = Validator::make($request->all(), [
            'name'         => 'required|string|max:255|unique:roles,name,' . $role->id,
            'guard_name'   => 'required|string|in:web,api',
            'permissions'   => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ])->validate();

        $role->update([
            'name'       => $validated['name'],
            'guard_name' => $validated['guard_name'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Delete a role.
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}

// namespace App\Http\Controllers;


// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Log;
// use Inertia\Inertia;
// use Inertia\Response;
// use Spatie\Permission\Models\Permission;
// use Spatie\Permission\Models\Role;
// use Illuminate\Support\Facades\Validator;

// class RoleController extends Controller
// {
//     public function __construct()
//     {
//         // $this->middleware('auth');
//         // Optionally: $this->middleware('can:manage roles');
//     }

//     /**
//      * Display a listing of the roles.
//      */
//     // public function index(): Response
//     // {
//     //     $roles = SpatieRole::withCount('permissions')->get();

//     //     return Inertia::render('roles/allRoles', [
//     //         'roles' => $roles,
//     //     ]);
//     // }
//      public function index(Request $request)
//     {
//         // Start query for roles
//         $query = Role::query();

//         // Example: apply search filter if 'search' query param is present
//         if ($request->filled('search')) {
//             $query->where('name', 'like', '%'.$request->search.'%');
//         }

//         // Example: apply sorting if 'sort' param provided
//         if ($request->filled('sort')) {
//             $order = $request->get('order', 'asc');
//             $query->orderBy($request->sort, $order);
//         }

//         // Include counts for related permissions and users
//         $query->withCount(['permissions', 'users']);

//         $roles = $query->paginate(2)
//             ->through(fn($role) => [
//                 'id' => $role->id,
//                 'name' => $role->name,
//                 'guard_name' => $role->guard_name,
//                 'permissions_count' => $role->permissions_count,
//                 'users_count' => $role->users_count,
//             ]);

//         return Inertia::render('roles/index', [
//             'roles' => $roles,
//         ]);
//     }

//     /**
//      * Show the form for creating a new role.
//      */
//     public function create(): Response
//     {
//         $permissions = Permission::all()->groupBy('category');

//         return Inertia::render('roles/createRoles', [
//             'permissions' => $permissions,
//         ]);
//     }

//     /**
//      * Store a newly created role in storage.
//      */
//     public function store(Request $request)
//     {
//         $validated = Validator::make($request->all(), [
//             'name' => 'required|string|max:255|unique:roles,name',
//             'guard_name' => 'required|string|in:web,api',
//             'permissions' => 'array',
//             'permissions.*' => 'string|exists:permissions,name',
//         ])->validate();

//         Log::info('Creating role with data:', $validated);

//         $role = Role::create([
//             'name' => $validated['name'],
//             'guard_name' => $validated['guard_name'],
//         ]);

//         $role->syncPermissions($validated['permissions']);

//         return redirect()->route('roles.index')->with('success', 'Role created successfully.');
//     }

//     /**
//      * Show the form for editing the specified role.
//      */
//     public function edit(Role $role): Response
//     {
//         $permissions = Permission::all()->groupBy('category');
//         $rolePermissions = $role->permissions->pluck('name');

//         return Inertia::render('roles/editRole', [
//             'role' => $role,
//             'permissions' => $permissions,
//             'rolePermissions' => $rolePermissions,
//         ]);
//     }

//     /**
//      * Update the specified role in storage.
//      */
//     public function update(Request $request, Role $role)
//     {
//         $validated = Validator::make($request->all(), [
//             'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
//             'guard_name' => 'required|string|in:web',
//             'permissions' => 'array',
//             'permissions.*' => 'string|exists:permissions,name',
//         ])->validate();

//         $role->update([
//             'name' => $validated['name'],
//             'guard_name' => $validated['guard_name'],
//         ]);

//         $role->syncPermissions($validated['permissions']);

//         return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
//     }

//     /**
//      * Remove the specified role from storage.
//      */
//     public function destroy(Role $role)
//     {
//         $role->delete();

//         return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
//     }
// }



