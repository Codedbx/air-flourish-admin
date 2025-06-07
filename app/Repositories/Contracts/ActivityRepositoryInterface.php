<?php

namespace App\Repositories\Contracts;

use App\Models\Activity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ActivityRepositoryInterface
{
    public function filter(array $filters = []): Collection|LengthAwarePaginator;
    public function getByAgentId(int $agentId, array $filters = []): Collection|LengthAwarePaginator;
    public function find(int $id): ?Activity;
    public function create(array $data): Activity;
    public function update(int $id, array $data): Activity;
    public function delete(int $id): bool;
}