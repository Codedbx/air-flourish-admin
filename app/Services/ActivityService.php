<?php

namespace App\Services;

use App\Models\Activity;
use App\Repositories\ActivityRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ActivityService
{
    public function __construct(
        private ActivityRepository $activityRepository
    ) {}

   /**
     * Get all activities with optional filters
     */
    public function getAllActivities(array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->activityRepository->filter($filters);
    }

    /**
     * Get activities for a specific agent
     */
    public function getAgentActivities(int $agentId, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->activityRepository->getByAgentId($agentId, $filters);
    }

    /**
     * Get a single activity by ID
     */
    public function getActivity(int $id): ?Activity
    {
        return $this->activityRepository->find($id);
    }

    /**
     * Create a new activity with related data
     */
    public function createActivity(array $data): Activity
    {
        return DB::transaction(function () use ($data) {
            $payload = $this->mapActivityData($data);
            $activity = $this->activityRepository->create($payload);

            // Handle time slots
            if (!empty($data['time_slots'])) {
                $this->createTimeSlots($activity, $data['time_slots']);
            }

            return $activity->load(['timeSlots']);
        });
    }

    /**
     * Update an existing activity
     */
    public function updateActivity(int $id, array $data): Activity
    {
        return DB::transaction(function () use ($id, $data) {
            $payload = $this->mapActivityData($data);
            $activity = $this->activityRepository->update($id, $payload);

            // Handle time slots operations
            if (isset($data['time_slots'])) {
                $this->updateTimeSlots($activity, $data);
            }

            return $activity->load(['timeSlots']);
        });
    }

    /**
     * Delete an activity
     */
    public function deleteActivity(int $id): bool
    {
        return $this->activityRepository->delete($id);
    }

    /**
     * Map request data to activity fields
     */
    private function mapActivityData(array $data): array
    {
        return [
            'agent_id' => $data['agent_id'] ?? Auth::id(),
            'title' => $data['title'],
            'location' => $data['location'],
            'price' => $data['price'],
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
        ];
    }

    /**
     * Create time slots for an activity
     */
    private function createTimeSlots(Activity $activity, array $timeSlots): void
    {
        foreach ($timeSlots as $slotData) {
            $activity->timeSlots()->create([
                'starts_at' => $slotData['starts_at'],
                'ends_at' => $slotData['ends_at']
            ]);
        }
    }

    /**
     * Update time slots for an activity
     */
    private function updateTimeSlots(Activity $activity, array $data): void
    {
        // Remove existing time slots if requested
        if (isset($data['replace_slots']) && $data['replace_slots']) {
            $activity->timeSlots()->delete();
        }

        // Process each time slot
        foreach ($data['time_slots'] as $slotData) {
            if (isset($slotData['id'])) {
                // Update existing slot
                $activity->timeSlots()->where('id', $slotData['id'])->update([
                    'starts_at' => $slotData['starts_at'],
                    'ends_at' => $slotData['ends_at'],
                ]);
            } else {
                // Create new slot
                $activity->timeSlots()->create([
                    'starts_at' => $slotData['starts_at'],
                    'ends_at' => $slotData['ends_at'],
                ]);
            }
        }

        // Delete specified time slots
        if (!empty($data['delete_time_slots'])) {
            $activity->timeSlots()->whereIn('id', $data['delete_time_slots'])->delete();
        }
    }


}