<?php

namespace App\Repositories;

use App\Models\Activity;
use App\Repositories\Contracts\ActivityRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityRepository implements ActivityRepositoryInterface
{
     public function filter(array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->applyFilters(Activity::query(), $filters)
            ->with(['timeSlots'])
            ->get();
    }

    public function getByAgentId(int $agentId, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->applyFilters(
            Activity::where('agent_id', $agentId),
            $filters
        )->with(['timeSlots'])->get();
    }

    public function find(int $id): ?Activity
    {
        return Activity::with(['timeSlots'])->find($id);
    }

    public function create(array $data): Activity
    {
        return Activity::create($data);
    }

    public function update(int $id, array $data): Activity
    {
        $activity = Activity::findOrFail($id);
        $activity->update($data);
        return $activity->fresh(); 
    }

    public function delete(int $id): bool
    {
        return Activity::destroy($id);
    }

    protected function applyFilters(Builder $query, array $filters): Builder
    {
        // Agent filter
        if (isset($filters['agent_id'])) {
            $query->where('agent_id', $filters['agent_id']);
        }

        // Title search
        if (isset($filters['title'])) {
            $query->where('title', 'like', '%' . $filters['title'] . '%');
        }

        // Location search
        if (isset($filters['location'])) {
            $query->where('location', 'like', '%' . $filters['location'] . '%');
        }

        // Price range
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Date range (using activity's start/end times)
        if (isset($filters['start_date'])) {
            $query->whereDate('start_time', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->whereDate('end_time', '<=', $filters['end_date']);
        }

        return $query;
    }
}