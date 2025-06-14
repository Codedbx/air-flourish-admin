<?php

namespace App\Policies;

use App\Models\ActivityTimeSlot;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ActivityTimeSlotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view all timeslots')
            || $user->can('view own timeslots');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ActivityTimeSlot $activityTimeSlot): bool
    {
        if ($user->can('view all timeslots')) {
            return true;
        }
        return $user->can('view own timeslots')
            && $activityTimeSlot->activity->agent_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create timeslots');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ActivityTimeSlot $activityTimeSlot): bool
    {
         if ($user->can('edit all timeslots')) {
            return true;
        }
        return $user->can('edit own timeslots')
            && $activityTimeSlot->activity->agent_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ActivityTimeSlot $activityTimeSlot): bool
    {
        if ($user->can('delete all timeslots')) {
            return true;
        }
        return $user->can('delete own timeslots')
            && $activityTimeSlot->activity->agent_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ActivityTimeSlot $activityTimeSlot): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ActivityTimeSlot $activityTimeSlot): bool
    {
        return false;
    }
}
