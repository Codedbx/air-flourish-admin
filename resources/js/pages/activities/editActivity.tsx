import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, HelpCircle, Plus, Save, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';

// Define types
interface TimeSlot {
  id: number;
  starts_at: string;
  ends_at: string;
}

interface Activity {
  id: number;
  title: string;
  location: string;
  price: string;
  time_slots: TimeSlot[];
}

interface FormData {
  title: string;
  location: string;
  price: string;
  time_slots: TimeSlot[];
}

export default function EditActivity({ activity }: { activity: Activity }) {
  const { data, setData, put, processing, errors } = useForm<FormData>({
    title: activity.title,
    location: activity.location,
    price: activity.price,
    time_slots: activity.time_slots.map(slot => ({
      id: slot.id,
      starts_at: slot.starts_at,
      ends_at: slot.ends_at
    })),
  });

  useEffect(() => {
    // Update form data when activity prop changes
    setData({
      title: activity.title,
      location: activity.location,
      price: activity.price,
      time_slots: activity.time_slots.map(slot => ({
        id: slot.id,
        starts_at: slot.starts_at,
        ends_at: slot.ends_at
      })),
    });
  }, [activity]);

  const addTimeSlot = () => {
    const newSlot: TimeSlot = { id: Date.now(), starts_at: '', ends_at: '' };
    setData('time_slots', [...data.time_slots, newSlot]);
  };

  const removeTimeSlot = (id: number) => {
    if (data.time_slots.length > 1) {
      setData('time_slots', data.time_slots.filter((slot) => slot.id !== id));
    }
  };

  const updateTimeSlot = (id: number, field: keyof TimeSlot, value: string) => {
    setData(
      'time_slots',
      data.time_slots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...data,
      time_slots: data.time_slots
        .filter((slot) => slot.starts_at && slot.ends_at)
        .map((slot) => ({ 
          id: slot.id, 
          starts_at: slot.starts_at, 
          ends_at: slot.ends_at 
        })),
    };

    put(route('activities.update', { activity: activity.id }), { data: formattedData });
  };

  const isFormValid = () =>
    data.title &&
    data.location &&
    data.time_slots.some((slot) => slot.starts_at && slot.ends_at);

  const breadcrumbs = [
    { title: 'Activities', href: route('activities.index') },
    { title: 'Edit Activity', href: route('activities.edit', { activity: activity.id }) },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Activity" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Edit Activity: {activity.title}
          </h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-title" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Title *
              </Label>
              <Input
                id="activity-title"
                placeholder="e.g., Swimming, Hiking, City Tour"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
              {errors.title && <span className="text-sm text-red-600">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="activity-location" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Location *
                </Label>
                <Input
                  id="activity-location"
                  placeholder="e.g., Paris, France"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
                {errors.location && <span className="text-sm text-red-600">{errors.location}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-price" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Price (Cannot be updated)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <Input
                    id="activity-price"
                    type="text"
                    value={data.price}
                    disabled
                    className="w-full h-10 pl-8 pr-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 sm:pt-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Time Slots *</h3>
                <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                <span className="sr-only">Define when this activity is available</span>
              </div>
              <Button
                type="button"
                onClick={addTimeSlot}
                size="sm"
                className="flex items-center gap-2 h-8 px-3 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 w-fit"
              >
                <Plus className="w-3 h-3" />
                Add Time Slot
              </Button>
            </div>

            {data.time_slots.map((slot, index) => (
              <div
                key={slot.id}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 mb-4 dark:bg-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Time Slot {index + 1}
                  </h4>
                  {data.time_slots.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTimeSlot(slot.id)}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      Start Time *
                    </Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={slot.starts_at}
                        onChange={(e) => updateTimeSlot(slot.id, 'starts_at', e.target.value)}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                        required
                      />
                      <Clock className="absolute right-2 top-2 w-4 h-4 text-gray-400 dark:text-gray-300 pointer-events-none" />
                    </div>
                    {errors[`time_slots.${index}.starts_at`] && (
                      <span className="text-sm text-red-600">{errors[`time_slots.${index}.starts_at`]}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      End Time *
                    </Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={slot.ends_at}
                        onChange={(e) => updateTimeSlot(slot.id, 'ends_at', e.target.value)}
                        className="w-full h-9 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100"
                        required
                      />
                      <Clock className="absolute right-2 top-2 w-4 h-4 text-gray-400 dark:text-gray-300 pointer-events-none" />
                    </div>
                    {errors[`time_slots.${index}.ends_at`] && (
                      <span className="text-sm text-red-600">{errors[`time_slots.${index}.ends_at`]}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {errors.time_slots && <span className="text-sm text-red-600">{errors.time_slots}</span>}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-2 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-4 text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex items-center gap-2 h-8 px-4 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
              disabled={!isFormValid() || processing}
            >
              <Save className="w-3 h-3" />
              {processing ? 'Updating...' : 'Update Activity'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}