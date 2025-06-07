<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserService
{
    private UserRepository $repo;

    public function __construct(UserRepository $repo)
    {
        $this->repo = $repo;
    }

     public function filter(array $filters): LengthAwarePaginator
    {
        return $this->repo->filter($filters);
    }


    /**
     * Retrieve a single user by ID (for edit/view).
     */
    public function find(int $id): User
    {
        return $this->repo->find($id);
    }

    
    public function create(array $data): User
    {
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $user = $this->repo->create($data);

        if (!empty($roles)) {
            $this->repo->syncRoles($user, $roles);
        }

        return $user;
    }


    public function update(User $user, array $data): User
    {
        $roles = $data['roles'] ?? [];
        unset($data['roles']);

        $user = $this->repo->update($user, $data);

        $this->repo->syncRoles($user, $roles);

        return $user;
    }

    /**
     * Delete a user from the system.
     */
    public function delete(User $user): void
    {
        $this->repo->delete($user);
    }

    
    public function getAllRoles(): Collection
    {
        return $this->repo->getAllRoles();
    }

    /**
     * Flip the 'active' flag on a user.
     */
    public function toggleActive(User $user, bool $active): User
    {
        return $this->repo->toggleActive($user, $active);
    }
}
