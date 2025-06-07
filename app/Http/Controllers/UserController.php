<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        // Restrict to authenticated admins, for example
        // $this->middleware(['auth', 'role:admin']);

        $this->userService = $userService;
    }

    /**
     * Display a listing of users with filters/sorting.
     */
    public function index(Request $request)
    {
       
        $filters = $request->only([
            'search',    
            'role',      
            'status',    
            'sort_by',   
            'sort_dir',  
            'per_page',  
            'page',      
        ]);


        $paginatedUsers = $this->userService->filter($filters);


        $roles = Role::pluck('name');
        Log::info('Roles fetched for user index', ['roles' => $roles,
            'filters' => $filters,
            'paginatedUsers' => $paginatedUsers->toArray()]
        );

        return Inertia::render('users/allUsers', [
            'users'   => $paginatedUsers,
            'roles'   => $roles,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $roles = Role::where('name', '!=', 'super-admin')->get();

        return Inertia::render('users/createUser', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'                 => 'required|string|max:255',
            'last_name'                  => 'required|string|max:255',
            'business_name'              => 'nullable|string|max:255',
            'email'                      => 'required|email|unique:users,email',
            'password'                   => 'required|string|min:8|confirmed',
            'phone'                      => 'nullable|string|max:50',
            'address'                    => 'nullable|string|max:255',
            'city'                       => 'nullable|string|max:100',
            'state'                      => 'nullable|string|max:100',
            'country'                    => 'nullable|string|max:100',
            'zip_code'                   => 'nullable|string|max:20',
            'cac_reg_no'                 => 'nullable|string|max:100',
            'roles'                      => 'nullable|array',
            'roles.*'                    => 'string|exists:roles,name',
            'active'                     => 'boolean',
            'profile_image'              => 'nullable|file|image|max:2048',
            'registration_certificate'   => 'nullable|file|image|max:2048',
            'license_image'              => 'nullable|file|image|max:2048',
        ]);

        // Merge first_name + last_name into 'name'
        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        unset($validated['first_name'], $validated['last_name']);

        // Hash password
        $validated['password'] = Hash::make($validated['password']);

        $this->userService->create($validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }


    public function show(User $user)
    {
        $user = $this->userService->find($user->id);

        $userRoles = $user->roles->pluck('name')->toArray();

        return Inertia::render('users/showUser', [
            'user' => [
                'id'                           => $user->id,
                'name'                         => $user->name,
                'business_name'                => $user->business_name,
                'email'                        => $user->email,
                'phone'                        => $user->phone,
                'address'                      => $user->address,
                'city'                         => $user->city,
                'state'                        => $user->state,
                'country'                      => $user->country,
                'zip_code'                     => $user->zip_code,
                'cac_reg_no'                   => $user->cac_reg_no,
                'active'                       => $user->active,
                'roles'                   => $userRoles,
                'profile_image_url'            => $user->getFirstMediaUrl('profile_image'),
                'registration_certificate_url' => $user->getFirstMediaUrl('registration_certificate'),
                'license_image_url'            => $user->getFirstMediaUrl('license_image'),
                'last_login'                   => $user->last_login,
                'created_at'                   => $user->created_at,
            ],
        ]);
    }



    public function edit(User $user)
    {
        $user = $this->userService->find($user->id);
        $roles = $this->userService->getAllRoles();
        $userRoles = $user->roles->pluck('name')->toArray();

        return Inertia::render('users/editUser', [
            'user' => [
                'id'                             => $user->id,
                'name'                           => $user->name,
                'business_name'                  => $user->business_name,
                'email'                          => $user->email,
                'phone'                          => $user->phone,
                'address'                        => $user->address,
                'city'                           => $user->city,
                'state'                          => $user->state,
                'country'                        => $user->country,
                'zip_code'                       => $user->zip_code,
                'cac_reg_no'                     => $user->cac_reg_no,
                'active'                         => $user->active,
                'role_names'                     => $userRoles,
                'profile_image_url'              => $user->getFirstMediaUrl('profile_image'),
                'registration_certificate_url'   => $user->getFirstMediaUrl('registration_certificate'),
                'license_image_url'              => $user->getFirstMediaUrl('license_image'),
                'last_login'                     => $user->last_login,
                'created_at'                     => $user->created_at,
            ],
            'roles'     => $roles,
            'userRoles' => $userRoles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name'                 => 'required|string|max:255',
            'last_name'                  => 'required|string|max:255',
            'business_name'              => 'nullable|string|max:255',
            'email'                      => 'required|email|unique:users,email,' . $user->id,
            'password'                   => 'nullable|string|min:8|confirmed',
            'phone'                      => 'nullable|string|max:50',
            'address'                    => 'nullable|string|max:255',
            'city'                       => 'nullable|string|max:100',
            'state'                      => 'nullable|string|max:100',
            'country'                    => 'nullable|string|max:100',
            'zip_code'                   => 'nullable|string|max:20',
            'cac_reg_no'                 => 'nullable|string|max:100',
            'roles'                      => 'nullable|array',
            'roles.*'                    => 'string|exists:roles,name',
            'active'                     => 'boolean',
            'profile_image'              => 'nullable|file|image|max:2048',
            'registration_certificate'   => 'nullable|file|image|max:2048',
            'license_image'              => 'nullable|file|image|max:2048',
        ]);

        // Merge first + last name into 'name'
        $validated['name'] = trim($validated['first_name'] . ' ' . $validated['last_name']);
        unset($validated['first_name'], $validated['last_name']);

        // Only hash if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $this->userService->update($user, $validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $this->userService->delete($user);

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Toggle the "active" flag on a given user.
     */
    public function toggleActive(User $user)
    {
        $newStatus = ! $user->active;
        $this->userService->toggleActive($user, $newStatus);

        return redirect()
            ->route('users.index')
            ->with('success', 'User status updated.');
    }

    /**
     * Handle AJAX request to remove a specific media collection.
     *
     * Expects URL: POST /users/{user}/remove-media/{type}
     * where {type} is one of: profile, certificate, license
     */
    public function removeMedia(Request $request, User $user, $type)
    {
        $collection = match ($type) {
            'profile'      => 'profile_image',
            'certificate'  => 'registration_certificate',
            'license'      => 'license_image',
            default        => null,
        };

        if ($collection) {
            $user->clearMediaCollection($collection);
        }

        // Return back so that Inertia reloads the page fragment
        return back(303);
    }
}
