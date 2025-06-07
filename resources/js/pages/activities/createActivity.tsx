import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, HelpCircle, Plus, Save, X } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Create Activity',
        href: '/activities/create',
    },
];

export default function CreateActivity() {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    location: '',
    price: '',
    time_slots: [
      {
        id: Date.now(),
        starts_at: '',
        ends_at: '',
      },
    ],
  });

  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now(),
      starts_at: '',
      ends_at: '',
    };
    setData('time_slots', [...data.time_slots, newSlot]);
  };

  const removeTimeSlot = (id: number) => {
    if (data.time_slots.length > 1) {
      setData('time_slots', data.time_slots.filter((slot) => slot.id !== id));
    }
  };

  const updateTimeSlot = (id: number, field: string, value: string) => {
    setData('time_slots', 
      data.time_slots.map((slot) => 
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty time slots and format data
    const formattedData = {
      ...data,
      time_slots: data.time_slots
        .filter((slot) => slot.starts_at && slot.ends_at)
        .map((slot) => ({
          starts_at: slot.starts_at,
          ends_at: slot.ends_at,
        })),
    };

    post(route('activities.store'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const isFormValid = () => {
    return (
      data.title &&
      data.location &&
      data.price &&
      data.time_slots.some((slot) => slot.starts_at && slot.ends_at)
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Activity" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium text-gray-900">Create Activity</h2>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Activity Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-title" className="text-sm font-medium text-gray-700">
                Title *
              </Label>
              <Input
                id="activity-title"
                placeholder="e.g., Swimming, Hiking, City Tour"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                required
              />
              {errors.title && (
                <span className="text-sm text-red-600">{errors.title}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                <Label htmlFor="activity-location" className="text-sm font-medium text-gray-700">
                  Location *
                </Label>
                <Input
                  id="activity-location"
                  placeholder="e.g., Paris, France"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50"
                  required
                />
                {errors.location && (
                  <span className="text-sm text-red-600">{errors.location}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-price" className="text-sm font-medium text-gray-700">
                  Price *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="activity-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    className="w-full h-10 pl-8 pr-3 border border-gray-300 rounded-md bg-gray-50"
                    required
                  />
                </div>
                {errors.price && (
                  <span className="text-sm text-red-600">{errors.price}</span>
                )}
              </div>
              
            </div>

            
          </div>

          {/* Time Slots Section */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium text-gray-900">Time Slots *</h3>
                <HelpCircle className="w-4 h-4 text-gray-400">
                  <title>Define when this activity is available</title>
                </HelpCircle>
              </div>
              <Button
                type="button"
                onClick={addTimeSlot}
                size="sm"
                className="flex items-center gap-2 h-8 px-3 text-xs bg-gray-900 text-white hover:bg-gray-800 w-fit"
              >
                <Plus className="w-3 h-3" />
                Add Time Slot
              </Button>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
              {data.time_slots.map((slot, index) => (
                <div key={slot.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Time Slot {index + 1}</h4>
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
                      <Label className="text-xs font-medium text-gray-600">Start Time *</Label>
                      <div className="relative">
                        <Input
                          type="datetime-local"
                          value={slot.starts_at}
                          onChange={(e) => updateTimeSlot(slot.id, 'starts_at', e.target.value)}
                          className="w-full h-9 px-3 border border-gray-300 rounded-md bg-white text-sm"
                          required
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-gray-600">End Time *</Label>
                      <div className="relative">
                        <Input
                          type="datetime-local"
                          value={slot.ends_at}
                          onChange={(e) => updateTimeSlot(slot.id, 'ends_at', e.target.value)}
                          className="w-full h-9 px-3 border border-gray-300 rounded-md bg-white text-sm"
                          required
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.time_slots && (
              <span className="text-sm text-red-600">{errors.time_slots}</span>
            )}
          </div>

          {/* Activity Data Preview */}
          {(data.title || data.price) && (
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Form Data Preview</h3>
              <div className="p-3 bg-gray-100 rounded-md text-xs font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {JSON.stringify(
                    {
                      title: data.title || "Activity title...",
                      location: data.location || "Location...",
                      price: data.price ? parseFloat(data.price).toFixed(2) : "0.00",
                      time_slots: data.time_slots
                        .filter((slot) => slot.starts_at && slot.ends_at)
                        .map((slot) => ({
                          starts_at: slot.starts_at,
                          ends_at: slot.ends_at,
                        })),
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-2 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="flex items-center gap-2 h-8 px-4 text-sm bg-gray-900 text-white hover:bg-gray-800"
              disabled={!isFormValid() || processing}
              onClick={handleSubmit}
            >
              <Save className="w-3 h-3" />
              {processing ? 'Creating...' : 'Create Activity'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}