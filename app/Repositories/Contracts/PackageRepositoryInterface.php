<?php
namespace App\Repositories\Contracts;

use App\Models\Package;
use Illuminate\Pagination\LengthAwarePaginator;

interface PackageRepositoryInterface
{
    public function all();
    public function find(int $id): ?Package;
    public function create(array $data): Package;
    public function update(int $id, array $data): Package;
    public function delete(int $id): bool;
    public function filter(array $filters): LengthAwarePaginator;
    public function getByOwner(int $ownerId);
}