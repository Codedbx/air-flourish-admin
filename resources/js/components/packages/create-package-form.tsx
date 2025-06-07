import React, { FormEventHandler, useState } from "react";
import { useForm } from '@inertiajs/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Shield, 
  Upload, 
  Plus, 
  X, 
  Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/multi-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {  InertiaFormOptions } from "@/types";
import { type Package as PackageFormData } from "@/types/package";
import { Activity } from '@/types/package';

interface CreatePackageFormProps {
  availableActivities: Activity[];
}

export default function CreatePackageForm({ availableActivities }: CreatePackageFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const { data, setData, post, processing, errors, reset, progress } = useForm<PackageFormData>({
    title: "",
    description: "",
    base_price: "",
    location: "",
    agent_addon_price: "",
    agent_price_type: "fixed",
    check_in_time: "",
    check_out_time: "",
    booking_start_date: "",
    booking_end_date: "",
    is_active: true,
    is_featured: false,
    is_refundable: true,
    visibility: "public",
    terms_and_conditions: "",
    cancellation_policy: "",
    flight_from: "",
    flight_to: "",
    airline_name: "",
    booking_class: "",
    hotel_name: "",
    hotel_star_rating: "",
    hotel_checkin: "",
    hotel_checkout: "",
    activities: [],
    images: [],
  });

  // Transform activities for MultiSelect component
  const activityOptions = availableActivities.map(activity => ({
    label: `${activity.title} - $${activity.price}`,
    value: activity.id.toString(), // Convert to string for MultiSelect
  }));

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to 10 images total
      const currentImages = data.images.length;
      const remainingSlots = 10 - currentImages;
      const filesToAdd = files.slice(0, remainingSlots);
      
      setData('images', [...data.images, ...filesToAdd]);
      
      // Create preview URLs
      const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    // Clean up the URL object
    URL.revokeObjectURL(imagePreview[index]);
    
    setData('images', newImages);
    setImagePreview(newPreviews);
  };

  const handleActivityChange = (selectedValues: string[]) => {
    // Store activity IDs as strings
    setData('activities', selectedValues);
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        // Append each image file
        (value as File[]).forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else if (key === 'activities') {
        // Append activity IDs as array
        (value as string[]).forEach((activityId, index) => {
          formData.append(`activities[${index}]`, activityId);
        });
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const options: InertiaFormOptions<PackageFormData> = {
      forceFormData: true,
      onSuccess: () => {
        // Clean up preview URLs
        imagePreview.forEach(url => URL.revokeObjectURL(url));
        reset();
        setImagePreview([]);
        setCurrentStep(1);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      }
    };

    post(route('packages.store'), options);
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Package Activities" },
    { number: 3, title: "Flight & Hotel Details" },
    { number: 4, title: "Settings & Policies" }
  ];

  // Validation helper
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.title && data.description && data.base_price && data.location && 
                data.agent_addon_price && data.agent_price_type && data.check_in_time && data.check_out_time);
      case 2:
        return true; // Activities are optional
      case 3:
        return true; // Flight and hotel details are optional
      case 4:
        return true; // All fields in this step are optional or have defaults
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl font-medium text-gray-900 mb-4">
          Travel Package Builder
        </CardTitle>
        
        {/* Step Progress */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.number}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Upload Progress Bar */}
        {progress && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Uploading package...</span>
              <span className="text-sm text-gray-600">{Math.round(progress.percentage || 0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress.percentage || 0}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      {/* Form Content */}
      <CardContent className="p-6">
        <form onSubmit={submit}>
          {/* Form steps rendered conditionally based on currentStep */}
          {currentStep === 1 && (
            <BasicInformationStep 
              data={data} 
              setData={setData} 
              errors={errors} 
            />
          )}

          {currentStep === 2 && (
            <ActivitiesStep 
              data={data} 
              setData={setData} 
              errors={errors}
              activityOptions={activityOptions}
              availableActivities={availableActivities}
              handleActivityChange={handleActivityChange}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              imagePreview={imagePreview}
            />
          )}

          {currentStep === 3 && (
            <FlightHotelStep 
              data={data} 
              setData={setData} 
              errors={errors} 
            />
          )}

          {currentStep === 4 && (
            <PoliciesStep 
              data={data} 
              setData={setData} 
              errors={errors} 
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2"
                  disabled={!isStepValid(currentStep)}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={processing}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Package</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}