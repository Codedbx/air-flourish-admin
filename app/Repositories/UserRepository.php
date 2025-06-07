<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Models\Role;

class UserRepository
{
    public function filter(array $filters): LengthAwarePaginator
    {
        $query = User::with('roles');

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (! empty($filters['role']) && $filters['role'] !== 'all') {
            $query->byRole($filters['role']);
        }

        if (! empty($filters['status']) && in_array($filters['status'], ['active','inactive'], true)) {
            $query->byStatus($filters['status']);
        }

        $sortBy  = $filters['sort_by']  ?? 'name';
        $sortDir = $filters['sort_dir'] ?? 'asc';
        $query->ordered($sortBy, $sortDir);
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 10;
        return $query->paginate($perPage)->withQueryString();
    }


    public function create(array $data): User
    {
        $user = User::create($data);
        $this->handleMedia($user, $data);
        return $user;
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        $this->handleMedia($user, $data);
        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

     
    public function find(int $id): User
    {
        return User::with(['roles', 'media'])->findOrFail($id);
    }

   
    public function syncRoles(User $user, array $roles): void
    {
        $user->syncRoles($roles);
    }


    public function toggleActive(User $user, bool $active): User
    {
        $user->active = $active;
        $user->save();
        return $user;
    }

   
    public function getAllRoles(): Collection
    {
        return Role::all();
    }

    
    private function handleMedia(User $user, array $data): void
    {
        foreach (['profile_image', 'registration_certificate', 'license_image'] as $collection) {
            if (!empty($data[$collection])) {
                $user->clearMediaCollection($collection);
                $user->addMedia($data[$collection])->toMediaCollection($collection);
            }
        }
    }
}