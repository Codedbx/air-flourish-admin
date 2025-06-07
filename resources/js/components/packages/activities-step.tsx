import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { MultiSelect } from "@/components/multi-select";
import { Activity, PackageFormData } from "@/types";

interface ActivitiesStepProps {
  data: PackageFormData;
  setData: (key: keyof PackageFormData, value: any) => void;
  errors: Record<string, string>;
  activityOptions: { label: string; value: string }[];
  availableActivities: Activity[];
  handleActivityChange: (selectedValues: string[]) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  imagePreview: string[];
}

export default function ActivitiesStep({
  data,
  setData,
  errors,
  activityOptions,
  availableActivities,
  handleActivityChange,
  handleImageUpload,
  removeImage,
  imagePreview
}: ActivitiesStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h3 className="text-lg font-medium text-gray-900">Package Activities</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Select Activities
          </Label>
          <MultiSelect
            options={activityOptions}
            value={data.activities}
            onValueChange={handleActivityChange}
            placeholder="Select activities for this package"
            variant="inverted"
            maxCount={3}
          />
          <p className="text-sm text-gray-500">
            Choose activities that are included in this package. You can select multiple options.
          </p>
          {errors.activities && <p className="text-sm text-red-600">{errors.activities}</p>}
        </div>

        {data.activities.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Activities:</h4>
            <div className="flex flex-wrap gap-2">
              {data.activities.map((activityId, index) => {
                const activity = availableActivities.find(a => a.id.toString() === activityId);
                return (
                  <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {activity ? `${activity.title} - $${activity.price}` : `Activity #${activityId}`}
                    <button
                      type="button"
                      onClick={() => {
                        const newActivities = data.activities.filter(id => id !== activityId);
                        setData('activities', newActivities);
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Media Upload Section */}
        <Separator className="my-6" />
        
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-gray-900">Package Media</h4>
          
          {/* Image Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Package Images
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex items-center gap-2"
                  disabled={data.images.length >= 10}
                >
                  <Upload className="w-4 h-4" />
                  Upload Images
                </Button>
                <p className="text-sm text-gray-500">
                  {data.images.length}/10 images • Max 5MB each
                </p>
              </div>
              {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}