<?php

namespace App\Http\Controllers;

use App\Services\ActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;


class ActivityController extends Controller
{
    public function __construct(
        private ActivityService $activityService
    ) {}

    /**
     * Display all activities
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'title', 
            'location', 
            'min_price', 
            'max_price',
            'start_date',
            'end_date',
            'agent_id'
        ]);

        $activities = $this->activityService->getAllActivities($filters);

        return Inertia::render('activities/allActivity', [
            'activities' => $activities,
            'filters' => $filters
        ]);
    }

    /**
     * Display activities for a specific agent
     */
    public function agentActivities(Request $request, int $agentId)
    {
        $filters = $request->only([
            'title', 
            'location', 
            'min_price', 
            'max_price',
            'start_date',
            'end_date'
        ]);

        $activities = $this->activityService->getAgentActivities($agentId, $filters);

        return Inertia::render('activities/agentActivities', [
            'activities' => $activities,
            'agentId' => $agentId,
            'filters' => $filters
        ]);
    }

    /**
     * Display activity details
     */
    public function show(int $id)
    {
        $activity = $this->activityService->getActivity($id);

        return Inertia::render('activities/Show', [
            'activity' => $activity
        ]);
    }
    

    public function create()
    {
        return Inertia::render('activities/createActivity');
    }

    public function edit(int $id)
    {
        $activity = $this->activityService->getActivity($id);

        return Inertia::render('activities/createActivity', [
            'activity' => $activity
        ]);
    }

    /**
     * Store new activity
     */
    public function store(StoreActivityRequest $request)
    {
        $validated = $request->validated();

        $activity = $this->activityService->createActivity($validated);

        return redirect()->route('activities.show', $activity->id)
            ->with('success', 'Activity created successfully!');
    }

    /**
     * Update existing activity
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
            'time_slots' => 'nullable|array',
            'time_slots.*.id' => 'sometimes|integer|exists:activity_time_slots,id',
            'time_slots.*.starts_at' => 'required_with:time_slots|date',
            'time_slots.*.ends_at' => 'required_with:time_slots|date|after:time_slots.*.starts_at',
            'delete_time_slots' => 'nullable|array',
            'delete_time_slots.*' => 'integer|exists:activity_time_slots,id',
            'replace_slots' => 'sometimes|boolean',
        ]);

        $activity = $this->activityService->updateActivity($id, $validated);

        return redirect()->route('activities.show', $id)
            ->with('success', 'Activity updated successfully!');
    }

    /**
     * Delete activity
     */
    public function destroy(int $id)
    {
        $this->activityService->deleteActivity($id);

        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully!');
    }

}
