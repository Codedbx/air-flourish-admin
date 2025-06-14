<?php

namespace App\Http\Controllers;

use App\Services\ActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

use App\Models\Activity;
use Illuminate\Support\Facades\Gate;

class ActivityController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private ActivityService $activityService
    ) {
        
        

    }

    /**
     * Display all activities
     */
    public function index(Request $request)
    {

        $this->authorize('viewAny', Activity::class);

        $filters = $request->only([
            'title', 
            'location', 
            'min_price', 
            'max_price',
            'start_date',
            'end_date',
            'agent_id'
        ]);

        $user = $request->user();
        
        // If the user cannot view all, filter to their own
        if (!$user->can('view all activities')) {
            $filters['agent_id'] = $user->id;
        }
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
        // Gate::allows('view all activities');

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
    public function show(Activity $activity)
    {
        $this->authorize('view', $activity);

        $activity = $this->activityService->getActivity($activity->id);

        return Inertia::render('activities/Show', [
            'activity' => $activity
        ]);
    }
    

    public function create()
    {
        $this->authorize('create', Activity::class);

        return Inertia::render('activities/createActivity');
    }

    public function edit(Activity $activity)
    {
        $this->authorize('view', $activity);

        $activity = $this->activityService->getActivity($activity->id);

        return Inertia::render('activities/editActivity', [
            'activity' => $activity
        ]);
    }

    /**
     * Store new activity
     */
    public function store(StoreActivityRequest $request)
    {
        $this->authorize('create', Activity::class);

        $validated = $request->validated();

        $activity = $this->activityService->createActivity($validated);

        return redirect()->route('activities.index', $activity->id)
            ->with('success', 'Activity created successfully!');
    }

    /**
     * Update existing activity
     */
    public function update(Request $request, Activity $activity)
    {
        $this->authorize('update', $activity);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'time_slots' => 'nullable|array',
            'time_slots.*.starts_at' => ['required','date_format:H:i'],
            'time_slots.*.ends_at'   => ['required','date_format:H:i','after:time_slots.*.starts_at'],
        ]);

        $activity = $this->activityService->updateActivity($activity->id, $validated);

        return redirect()->route('activities.show', $activity->id)
            ->with('success', 'Activity updated successfully!');
    }

    /**
     * Delete activity
     */
    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);
        $this->activityService->deleteActivity($activity->id);

        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully!');
    }

}
