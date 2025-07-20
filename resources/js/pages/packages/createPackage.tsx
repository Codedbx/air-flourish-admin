import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Shield,
  Upload,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/multi-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Package } from '@/types/package';
import { toast } from 'sonner';
import LocationSearch from '@/components/LocationSearch';

import { format } from "date-fns";
import { isBefore, isSameDay, parseISO } from "date-fns";
import { DatePicker } from '@/components/DatePicker';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Packages', href: '/packages' },
  { title: 'Create Package', href: '/packages/create' },
];

type CreatePackagePageProps = {
  activities: { id: number; title: string; price: number }[];
  flash: { success?: string };
};

export default function CreatePackages() {
  const { activities, flash } = usePage<CreatePackagePageProps>().props;
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Inertia form
  const {
    data,
    setData,
    post,
    processing,
    errors,
    reset,
    progress,
  } = useForm<Package>({
    title: '',
    description: '',
    base_price: '',
    location: '',
    agent_addon_price: '',
    agent_price_type: 'fixed',
    booking_start_date: '',
    booking_end_date: '',
    is_active: true,
    is_featured: false,
    is_refundable: true,
    visibility: 'public',
    terms_and_conditions: '',
    cancellation_policy: '',
    flight_from: '',
    flight_to: '',
    airline_name: '',
    booking_class: '',
    hotel_name: '',
    hotel_star_rating: '',
    hotel_checkin: '',
    hotel_checkout: '',
    activities: [],
    images: [],
  });


  const [bookingStart, setBookingStart] = useState<Date | undefined>(
  data.booking_start_date ? parseISO(data.booking_start_date) : undefined
)
const [bookingEnd, setBookingEnd] = useState<Date | undefined>(
  data.booking_end_date ? parseISO(data.booking_end_date) : undefined
)
const [hotelCheckin, setHotelCheckin] = useState<Date | undefined>(
  data.hotel_checkin ? parseISO(data.hotel_checkin) : undefined
)
const [hotelCheckout, setHotelCheckout] = useState<Date | undefined>(
  data.hotel_checkout ? parseISO(data.hotel_checkout) : undefined
)



  // If controller flashed success, toast and navigate to index
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
      router.visit(route('packages.index'));
    }
  }, [flash.success]);

  // Display errors from backend
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors);
      errorMessages.forEach((error) => {
        toast.error(error);
      });
    }
  }, [errors]);

  // Map fields → step
  const stepFieldMap: Record<string, number> = {
    title: 1,
    description: 1,
    base_price: 1,
    location: 1,
    agent_addon_price: 1,
    agent_price_type: 1,
    images: 2,
    activities: 2,
    flight_from: 3,
    flight_to: 3,
    airline_name: 3,
    booking_class: 3,
    hotel_name: 3,
    hotel_star_rating: 3,
    hotel_checkin: 3,
    hotel_checkout: 3,
    visibility: 4,
    terms_and_conditions: 4,
    cancellation_policy: 4,
  };

  const activityOptions = activities.map((activity) => ({
    label: `${activity.title} - $${activity.price}`,
    value: activity.id.toString(),
  }));

  // Validation per step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!data.title.trim() &&
          !!data.description.trim() &&
          !!data.base_price &&
          !!data.location.trim() &&
          !!data.agent_addon_price &&
          !!data.agent_price_type.trim()
        );
      case 2:
        // require between 4 and 5 images
        return data.images.length >= 4 && data.images.length <= 5;
      case 3:
        return true;
      case 4:
        return !!data.visibility;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!isStepValid(currentStep)) {
      if (currentStep === 2) {
        toast.error('Please upload between 4 and 5 images before continuing.');
      } else {
        toast.error('Please complete all required fields before continuing.');
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Handle file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = data.images.length;
    const remainingSlots = 5 - currentCount;
    const filesToAdd = files.slice(0, remainingSlots);

    // check size ≤ 1MB each
    const oversized = filesToAdd.filter((file) => file.size > 1024 * 1024);
    if (oversized.length > 0) {
      toast.error('Each image must be less than 1MB.');
      return;
    }
    // update form data
    setData('images', [...data.images, ...filesToAdd]);
    // generate previews
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreview[index]);
    setData('images', newImages);
    setImagePreview(newPreviews);
  };

  const handleActivityChange = (selectedValues: string[]) => {
    const activityIds = selectedValues.map((v) => parseInt(v, 10));
    setData('activities', activityIds);
  };

  // Helper function to get error class
  const getInputErrorClass = (fieldName: string) => {
    return errors[fieldName] 
      ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400' 
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400';
  };

  // Submit handler
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!isStepValid(4)) {
      toast.error('Final step incomplete. Please review required fields.');
      return;
    }

    // Additional validation for images
    if (data.images.length < 4 || data.images.length > 5) {
      toast.error('Please upload between 4 and 5 images.');
      setCurrentStep(2);
      return;
    }

    // Build FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        (value as File[]).forEach((file, i) =>
          formData.append(`images[${i}]`, file)
        );
      } else if (key === 'activities') {
        (value as number[]).forEach((id, i) =>
          formData.append(`activities[${i}]`, id.toString())
        );
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    post(route('packages.store'), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: 'errors',
      onSuccess: () => {
        // After successful create, controller will flash success and redirect.
        // We revoke previews + reset local state:
        imagePreview.forEach((url) => URL.revokeObjectURL(url));
        reset();
        setImagePreview([]);
        setCurrentStep(1);
        // No need to toast here, since the `flash.success` effect will handle it.
      },
      onError: (errors) => {
        // Determine first step containing an error
        const fields = Object.keys(errors);
        const firstErrorStep = Math.min(
          ...fields.map((f) => stepFieldMap[f] || 1)
        );
        setCurrentStep(firstErrorStep);
        toast.error('There were validation errors. Please review the form.');
      },
    });
  };

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Package Activities & Media' },
    { number: 3, title: 'Flight & Hotel Details' },
    { number: 4, title: 'Settings & Policies' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Package" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 bg-white dark:bg-gray-900">
        <Card className="w-full mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
              Travel Package Builder
            </CardTitle>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep >= step.number
                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:inline ${
                      currentStep >= step.number
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        currentStep > step.number
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {progress && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Uploading package...</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {Math.round(progress.percentage || 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6 bg-white dark:bg-gray-800">
            <form onSubmit={submit}>
              {/* ----------- Step 1: Basic Information ----------- */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Basic Package Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Package Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury Paris Getaway"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={`w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${getInputErrorClass('title')}`}
                        required
                      />
                      {errors.title && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., 5-day luxury package with Eiffel Tower access"
                        value={data.description}
                        onChange={(e) =>
                          setData('description', e.target.value)
                        }
                        className={`w-full min-h-[80px] resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${getInputErrorClass('description')}`}
                        required
                      />
                      {errors.description && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="base_price"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Base Price ($) *
                      </Label>
                      <Input
                        id="base_price"
                        placeholder="e.g., 2999.99"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.base_price}
                        onChange={(e) => setData('base_price', e.target.value)}
                        className={`w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${getInputErrorClass('base_price')}`}
                        required
                      />
                      {errors.base_price && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.base_price}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Location *
                      </Label>
                      <div className={`${errors.location ? 'border border-red-500 dark:border-red-400 rounded-md' : ''}`}>
                        <LocationSearch 
                          onSelect={(value) => setData('location', value)}
                          value={data.location}
                        />
                      </div>
                      {errors.location && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="agent_addon_price"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Agent Addon Price *
                      </Label>
                      <Input
                        id="agent_addon_price"
                        placeholder="e.g., 299.99 or 15 (for percentage)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.agent_addon_price}
                        onChange={(e) =>
                          setData('agent_addon_price', e.target.value)
                        }
                        className={`w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${getInputErrorClass('agent_addon_price')}`}
                        required
                      />
                      {errors.agent_addon_price && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.agent_addon_price}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Agent Price Type *
                      </Label>
                      <Select
                        value={data.agent_price_type}
                        onValueChange={(value) =>
                          setData('agent_price_type', value)
                        }
                      >
                        <SelectTrigger className={`w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${getInputErrorClass('agent_price_type')}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          <SelectItem value="fixed" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">
                            Fixed Amount ($)
                          </SelectItem>
                          <SelectItem value="percentage" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">
                            Percentage (%)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.agent_price_type && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.agent_price_type}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="booking_start_date"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Booking Start Date
                      </Label>
                      <DatePicker
                        date={bookingStart}
                        onSelect={(d) => {
                          setBookingStart(d)
                          setData('booking_start_date', format(d, 'yyyy-MM-dd'))
                          if (bookingEnd && d > bookingEnd) {
                            setBookingEnd(undefined)
                            setData('booking_end_date', '')
                          }
                        }}
                        disabledBefore={(() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0); // Ensure time is reset
                          return today;
                        })()}
                      />


                      {errors.booking_start_date && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.booking_start_date}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="booking_end_date"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Booking End Date
                      </Label>
                      <DatePicker
                      date={bookingEnd}
                      onSelect={(d) => {
                        setBookingEnd(d);
                        setData("booking_end_date", format(d, "yyyy-MM-dd"));
                      }}
                      disabledBefore={bookingStart}
                    />
                      {errors.booking_end_date && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.booking_end_date}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------- Step 2: Activities & Media ----------- */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Package Activities
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Activities
                      </Label>
                      <div className={`${errors.activities ? 'border border-red-500 dark:border-red-400 rounded-md p-1' : ''}`}>
                        <MultiSelect
                          options={activityOptions}
                          value={data.activities.map((id) => id.toString())}
                          onValueChange={handleActivityChange}
                          placeholder="Select activities for this package"
                          variant="inverted"
                          maxCount={undefined}
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose activities included in this package.
                      </p>
                      {errors.activities && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.activities}
                          </p>
                        </div>
                      )}
                    </div>

                    {data.activities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Selected Activities:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {data.activities.map((activityId, index) => {
                            const activity = activities.find(
                              (a) => a.id === activityId
                            );
                            return (
                              <div
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                              >
                                {activity
                                  ? `${activity.title} - $${activity.price}`
                                  : `Activity #${activityId}`}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newActivities = data.activities.filter(
                                      (id) => id !== activityId
                                    );
                                    setData('activities', newActivities);
                                  }}
                                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6 bg-gray-200 dark:bg-gray-600" />

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Package Media (4-5 images, ≤1 MB each)
                    </h3>
                    <div className={errors.images ? 'border border-red-500 dark:border-red-400 p-2 rounded-md' : ''}>
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
                          onClick={() => {
                            document.getElementById('image-upload')?.click();
                          }}
                          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={data.images.length >= 5 || processing}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Images
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {data.images.length} / 5 {data.images.length < 4 && '(minimum 4 required)'}
                        </p>
                      </div>
                      {errors.images && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
                          <p className="text-sm text-red-600 dark:text-red-400">{errors.images}</p>
                        </div>
                      )}
                      {(data.images.length < 4 || data.images.length > 5) && (
                        <div className="flex items-center mt-1">
                          <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 mr-1" />
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            Please upload exactly 4 or 5 images to proceed.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Newly added previews */}
                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreview.map((preview, index) => (
                         <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
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
              )}

              {/* ----------- Step 3: Flight & Hotel Details ----------- */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Flight & Hotel Information
                  </h3>
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                      Flight Details (Optional)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="flight_from"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Flight From
                        </Label>
                        <Input
                          id="flight_from"
                          placeholder="e.g., New York (JFK)"
                          value={data.flight_from}
                          onChange={(e) => setData('flight_from', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {errors.flight_from && (
                          <p className="text-sm text-red-600">{errors.flight_from}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="flight_to"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Flight To
                        </Label>
                        <Input
                          id="flight_to"
                          placeholder="e.g., Paris (CDG)"
                          value={data.flight_to}
                          onChange={(e) => setData('flight_to', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {errors.flight_to && (
                          <p className="text-sm text-red-600">{errors.flight_to}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="airline_name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Airline Name
                        </Label>
                        <Input
                          id="airline_name"
                          placeholder="e.g., Air France"
                          value={data.airline_name}
                          onChange={(e) => setData('airline_name', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {errors.airline_name && (
                          <p className="text-sm text-red-600">{errors.airline_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="booking_class"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Booking Class
                        </Label>
                        <Select
                          value={data.booking_class}
                          onValueChange={(value) => setData('booking_class', value)}
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="economy" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Economy</SelectItem>
                            <SelectItem value="premium_economy" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Premium Economy
                            </SelectItem>
                            <SelectItem value="business" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">Business</SelectItem>
                            <SelectItem value="first" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.booking_class && (
                          <p className="text-sm text-red-600">{errors.booking_class}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="border-gray-200 dark:border-gray-700" />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                      Hotel Details (Optional)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="hotel_name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Hotel Name
                        </Label>
                        <Input
                          id="hotel_name"
                          placeholder="e.g., Le Meurice"
                          value={data.hotel_name}
                          onChange={(e) => setData('hotel_name', e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        {errors.hotel_name && (
                          <p className="text-sm text-red-600">{errors.hotel_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="hotel_star_rating"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Star Rating
                        </Label>
                        <Select
                          value={data.hotel_star_rating}
                          onValueChange={(value) => setData('hotel_star_rating', value)}
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="1" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">1 Star</SelectItem>
                            <SelectItem value="2" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">2 Stars</SelectItem>
                            <SelectItem value="3" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">3 Stars</SelectItem>
                            <SelectItem value="4" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">4 Stars</SelectItem>
                            <SelectItem value="5" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.hotel_star_rating && (
                          <p className="text-sm text-red-600">
                            {errors.hotel_star_rating}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="hotel_checkin"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Hotel Check-in Date
                        </Label>
                        <DatePicker
                        date={hotelCheckin}
                        onSelect={(d) => {
                          setHotelCheckin(d);
                          setData("hotel_checkin", format(d, "yyyy-MM-dd"));
                          if (hotelCheckout && d > hotelCheckout) { setHotelCheckout(undefined); setData("hotel_checkout", ""); }
                        }}
                        disabledBefore={bookingStart}
                      />
                        {errors.hotel_checkin && (
                          <p className="text-sm text-red-600">{errors.hotel_checkin}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="hotel_checkout"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Hotel Check-out Date
                        </Label>
                        <DatePicker
                          date={hotelCheckout}
                          onSelect={(d) => {
                            setHotelCheckout(d);
                            setData("hotel_checkout", format(d, "yyyy-MM-dd"));
                          }}
                          disabledBefore={hotelCheckin}
                        />
                        {errors.hotel_checkout && (
                          <p className="text-sm text-red-600">{errors.hotel_checkout}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------- Step 4: Settings & Policies ----------- */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Settings & Policies
                  </h3>
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Package Settings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Visibility
                        </Label>
                        <Select
                          value={data.visibility}
                          onValueChange={(value) => setData('visibility', value)}
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                            <SelectItem value="public" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Public - Visible to everyone
                            </SelectItem>
                            <SelectItem value="private" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Private - Only visible to you
                            </SelectItem>
                            <SelectItem value="agents_only" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Agents Only - Visible to agents
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.visibility && (
                          <p className="text-sm text-red-600">{errors.visibility}</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', !!checked)}
                            disabled={processing}
                            className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label
                            htmlFor="is_active"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Active Package
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Package is available for booking
                        </p>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_featured"
                            checked={data.is_featured}
                            onCheckedChange={(checked) => setData('is_featured', !!checked)}
                            disabled={processing}
                            className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label
                            htmlFor="is_featured"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Featured Package
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Display in featured packages section
                        </p>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_refundable"
                            checked={data.is_refundable}
                            onCheckedChange={(checked) => setData('is_refundable', !!checked)}
                            disabled={processing}
                            className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label
                            htmlFor="is_refundable"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Refundable
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                          Allow refunds for this package
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="border-gray-200 dark:border-gray-700" />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Terms & Conditions</h4>
                    <div className="space-y-2">
                      <Label
                        htmlFor="terms_and_conditions"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Terms and Conditions
                      </Label>
                      <Textarea
                        id="terms_and_conditions"
                        placeholder="Enter terms and conditions for this package..."
                        value={data.terms_and_conditions}
                        onChange={(e) =>
                          setData('terms_and_conditions', e.target.value)
                        }
                        className="w-full min-h-[120px] resize-y bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={processing}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Include important terms, conditions, and requirements for this package
                      </p>
                      {errors.terms_and_conditions && (
                        <p className="text-sm text-red-600">
                          {errors.terms_and_conditions}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator className="border-gray-200 dark:border-gray-700" />

                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Cancellation Policy</h4>
                    <div className="space-y-2">
                      <Label
                        htmlFor="cancellation_policy"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Cancellation Policy
                      </Label>
                      <Textarea
                        id="cancellation_policy"
                        placeholder="Enter cancellation policy for this package..."
                        value={data.cancellation_policy}
                        onChange={(e) =>
                          setData('cancellation_policy', e.target.value)
                        }
                        className="w-full min-h-[120px] resize-y bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={processing}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Define cancellation terms, deadlines, and refund policies
                      </p>
                      {errors.cancellation_policy && (
                        <p className="text-sm text-red-600">
                          {errors.cancellation_policy}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Policy Guidelines
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Ensure your terms and cancellation policies are clear and comply with
                          local regulations. Include details about booking changes, refund
                          timelines, and any non‐refundable fees.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------- Navigation Buttons ----------- */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      disabled={processing}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {currentStep < 4 ? (
                    <div
                      onClick={nextStep}
                      role="button"
                      tabIndex={0}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded text-white ${
                        processing
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          nextStep();
                        }
                      }}
                    >
                      {processing && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      )}
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
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
      </div>
    </AppLayout>
  );
}