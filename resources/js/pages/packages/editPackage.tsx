import React, { useEffect, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Shield,
  Upload,
  Plus,
  X,
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
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import {CustomButton} from '@/components/custom-button';

import { format } from "date-fns";
import { isBefore, isSameDay, parseISO } from "date-fns";
import { DatePicker } from '@/components/DatePicker';




export interface EditPackageForm {
  _method: string;
  title: string;
  description: string;
  base_price: string;
  location: string;
  agent_addon_price: string;
  agent_price_type: 'fixed' | 'percentage';
  booking_start_date: string;
  booking_end_date: string;
  is_active: boolean;
  is_featured: boolean;
  is_refundable: boolean;
  visibility: 'public' | 'private';
  terms_and_conditions: string;
  cancellation_policy: string;
  flight_from: string;
  flight_to: string;
  airline_name: string;
  booking_class: string;
  hotel_name: string;
  hotel_star_rating: string;
  hotel_checkin: string;
  hotel_checkout: string;
  activities: number[];
  images: File[];
  deleted_image_ids: number[];
  [key: string]: any;
}

type EditPackagePageProps = {
  package: {
    id: number;
    title: string;
    description: string;
    base_price: string;
    location: string;
    agent_addon_price: string;
    agent_price_type: string;
    booking_start_date: string | null;
    booking_end_date: string | null;
    is_active: boolean;
    is_featured: boolean;
    is_refundable: boolean;
    visibility: string;
    terms_and_conditions: string | null;
    cancellation_policy: string | null;
    flight_from: string | null;
    flight_to: string | null;
    airline_name: string | null;
    booking_class: string | null;
    hotel_name: string | null;
    hotel_star_rating: number | null;
    hotel_checkin: string | null;
    hotel_checkout: string | null;
    activities: { id: number; title: string; price: string }[];
  };
  allActivities: { id: number; title: string; price: number }[];
  images: { id: number; url: string; thumbnail: string }[];
  flash: { success?: string };
};

export default function EditPackage({
  package: pkg,
  allActivities,
  images: incomingImages,
  flash,
}: EditPackagePageProps) {
  const [existingMedia, setExistingMedia] = useState(incomingImages);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  

  const form = useForm<EditPackageForm>({
    _method: 'PUT',
    title: pkg.title || '',
    description: pkg.description || '',
    base_price: pkg.base_price || '',
    location: pkg.location || '',
    agent_addon_price: pkg.agent_addon_price || '',
    agent_price_type: pkg.agent_price_type as 'fixed' | 'percentage',
    booking_start_date: pkg.booking_start_date?.split('T')[0] || '',
    booking_end_date: pkg.booking_end_date?.split('T')[0] || '',
    is_active: pkg.is_active,
    is_featured: pkg.is_featured,
    is_refundable: pkg.is_refundable,
    visibility: pkg.visibility as 'public' | 'private',
    terms_and_conditions: pkg.terms_and_conditions || '',
    cancellation_policy: pkg.cancellation_policy || '',
    flight_from: pkg.flight_from || '',
    flight_to: pkg.flight_to || '',
    airline_name: pkg.airline_name || '',
    booking_class: pkg.booking_class || '',
    hotel_name: pkg.hotel_name || '',
    hotel_star_rating:
    pkg.hotel_star_rating !== null ? pkg.hotel_star_rating.toString() : '',
    hotel_checkin: pkg.hotel_checkin?.split('T')[0] || '',
    hotel_checkout: pkg.hotel_checkout?.split('T')[0] || '',
    activities: pkg.activities.map((a) => a.id),
    images: [],
    deleted_image_ids: [],
  });
  const { data, setData, processing, errors, progress } = form;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
      router.visit(route('packages.index'));
    }
  }, [flash.success]);


const [bookingStartDate, setBookingStartDate] = useState(
  data.booking_start_date ? parseISO(data.booking_start_date) : undefined
);
const [bookingEndDate, setBookingEndDate] = useState(
  data.booking_end_date ? parseISO(data.booking_end_date) : undefined
);

const [hotelCheckin, setHotelCheckin] = useState(
  data.hotel_checkin ? parseISO(data.hotel_checkin) : undefined
);
const [hotelCheckout, setHotelCheckout] = useState(
  data.hotel_checkout ? parseISO(data.hotel_checkout) : undefined
);


  // Map field names → step numbers (for error handling)
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
    is_active: 4,
    is_featured: 4,
    is_refundable: 4,
  };

  const [currentStep, setCurrentStep] = useState(1);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!data.title.trim() &&
          !!data.description.trim() &&
          !!data.base_price &&
          !!data.location.trim() &&
          !!data.agent_addon_price &&
          !!data.agent_price_type
        );
      case 2: {
        const existingCount = existingMedia.length;
        const newCount =
          Array.isArray(data.images)
            ? data.images.length
            : data.images instanceof FileList
            ? data.images.length
            : 0;
        const total = existingCount + newCount;
        return total >= 4 && total <= 5 && data.activities.length > 0;
      }
      case 3:
        return (
          !!data.flight_from.trim() &&
          !!data.flight_to.trim() &&
          !!data.airline_name.trim() &&
          !!data.booking_class &&
          !!data.hotel_name.trim() &&
          !!data.hotel_star_rating &&
          !!data.hotel_checkin &&
          !!data.hotel_checkout
        );
      case 4:
        return !!data.visibility;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 2) {
      if (data.activities.length === 0) {
        toast.error('Please select at least one activity.');
        return;
      }
      const existingCount = existingMedia.length;
      const newCount =
        Array.isArray(data.images)
          ? data.images.length
          : data.images instanceof FileList
          ? data.images.length
          : 0;
      const total = existingCount + newCount;
      if (total < 4 || total > 5) {
        toast.error('You need 4-5 images total.');
        return;
      }
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      const flightOk =
        data.flight_from.trim() &&
        data.flight_to.trim() &&
        data.airline_name.trim() &&
        data.booking_class;
      const hotelOk =
        data.hotel_name.trim() &&
        data.hotel_star_rating &&
        data.hotel_checkin &&
        data.hotel_checkout;
      if (!flightOk || !hotelOk) {
        toast.error(
          'All flight and hotel fields are required before you can continue.'
        );
        return;
      }
      setCurrentStep(4);
      return;
    }
    if (!isStepValid(currentStep)) {
      toast.error('Please complete all required fields.');
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };


  

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setData('images', files);
    const arr = Array.from(files);
    setImagePreview(arr.map((f) => URL.createObjectURL(f)));
  }

  function removeNewImage(index: number) {
    const arr = Array.from(data.images as FileList);
    const updated = arr.filter((_, i) => i !== index);
    const previews = imagePreview.filter((_, i) => i !== index);
    setData('images', updated);
    setImagePreview(previews);
  }

  function removeExistingImage(mediaId: number) {
    setExistingMedia((m) => m.filter((x) => x.id !== mediaId));
    setData('deleted_image_ids', [...data.deleted_image_ids, mediaId]);
  }

  function handleActivityChange(values: string[]) {
    setData(
      'activities',
      values.map((v) => parseInt(v, 10))
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('packages.update', pkg.id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Package updated successfully!'),
      onError: (errs) => {
        const fields = Object.keys(errs);
        const step = Math.min(...fields.map((f) => stepFieldMap[f] || 1));
        setCurrentStep(step);
        toast.error('Validation errors—please review the form.');
      },
    });
  }

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Activities & Media' },
    { number: 3, title: 'Flight & Hotel Details' },
    { number: 4, title: 'Settings & Policies' },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Packages', href: '/packages' },
        { title: 'Edit Package', href: `/packages/${pkg.id}/edit` },
      ]}
    >
      <Head title="Edit Package" />
      <div className="flex flex-col gap-4 p-4">
        <Card className="w-full mx-auto">
          <CardHeader className="border-b">
            <CardTitle className="text-xl font-medium mb-4">
              Edit Package
            </CardTitle>
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        currentStep >= step.number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden sm:inline ${
                        currentStep >= step.number
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        currentStep > step.number
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            {progress && (
              <div className="mt-4">
                <div className="flex justify-between mb-2 text-sm text-gray-600">
                  <span>Uploading package…</span>
                  <span>{Math.round(progress.percentage || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={submit}>
              {/* === Step 1: Basic Information === */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">
                    Basic Package Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Package Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury Paris Getaway"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                      />
                      {errors.title && (
                        <p className="text-red-600">{errors.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., 5-day luxury package…"
                        value={data.description}
                        onChange={(e) =>
                          setData('description', e.target.value)
                        }
                        required
                      />
                      {errors.description && (
                        <p className="text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base_price">Base Price ($) *</Label>
                      <Input
                        id="base_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.base_price}
                        onChange={(e) => setData('base_price', e.target.value)}
                        required
                      />
                      {errors.base_price && (
                        <p className="text-red-600">{errors.base_price}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <Input
                          id="location"
                          placeholder="e.g., Paris, France"
                          value={data.location}
                          onChange={(e) => setData('location', e.target.value)}
                          required
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.location && (
                        <p className="text-red-600">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent_addon_price">
                        Agent Addon Price *
                      </Label>
                      <Input
                        id="agent_addon_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.agent_addon_price}
                        onChange={(e) =>
                          setData('agent_addon_price', e.target.value)
                        }
                        required
                      />
                      {errors.agent_addon_price && (
                        <p className="text-red-600">
                          {errors.agent_addon_price}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Agent Price Type *</Label>
                      <Select
                        value={data.agent_price_type}
                        onValueChange={(value) =>
                          setData('agent_price_type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed ($)</SelectItem>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.agent_price_type && (
                        <p className="text-red-600">
                          {errors.agent_price_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="booking_start_date">
                        Booking Start Date
                      </Label>
                      <DatePicker
                      date={bookingStartDate}
                      onSelect={(d) => {
                        setBookingStartDate(d);
                        setData("booking_start_date", format(d, "yyyy-MM-dd"));
                        if (bookingEndDate && d > bookingEndDate) {
                          setBookingEndDate(undefined);
                          setData("booking_end_date", "");
                        }
                      }}
                      disabledBefore={(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // Ensure time is reset
                        return today;
                      })()}
                    />

                      {errors.booking_start_date && (
                        <p className="text-red-600">
                          {errors.booking_start_date}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="booking_end_date">
                        Booking End Date
                      </Label>
                      <DatePicker
                        date={bookingEndDate}
                        onSelect={(date) => {
                          setBookingEndDate(date);
                          setData("booking_end_date", format(date!, "yyyy-MM-dd"));
                        }}
                        disabledBefore={bookingStartDate}
                      />
                      {errors.booking_end_date && (
                        <p className="text-red-600">
                          {errors.booking_end_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 2: Activities & Media === */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Package Activities</h3>
                    <Label>Select Activities</Label>
                    <MultiSelect
                      options={allActivities.map((a) => ({
                        label: `${a.title} - $${a.price}`,
                        value: a.id.toString(),
                      }))}
                      value={data.activities.map((id) => id.toString())}
                      onValueChange={handleActivityChange}
                      placeholder="Select activities…"
                      maxCount={undefined}
                    />
                    {errors.activities && (
                      <p className="text-red-600">{errors.activities}</p>
                    )}
                    {data.activities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {data.activities.map((id) => {
                          const act = allActivities.find((a) => a.id === id);
                          return (
                            <div
                              key={id}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                            >
                              {act ? `${act.title} - $${act.price}` : id}
                              <button
                                type="button"
                                onClick={() =>
                                  setData(
                                    'activities',
                                    data.activities.filter((x) => x !== id)
                                  )
                                }
                                className="ml-2 hover:text-blue-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium">
                      Package Media (4-5 images)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {existingMedia.map((m) => (
                        <div key={m.id} className="relative group">
                          <img
                            src={m.url}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(m.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.images && (
                      <p className="text-red-600">{errors.images}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      Remove existing by clicking “X.” Keep total 4-5.
                    </p>

                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="new-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById('new-image-upload')
                            ?.click()
                        }
                        disabled={
                          existingMedia.length +
                            (Array.isArray(data.images)
                              ? data.images.length
                              : data.images instanceof FileList
                              ? data.images.length
                              : 0) >=
                            5 || processing
                        }
                      >
                        <Upload className="w-4 h-4" /> Upload New Images
                      </Button>
                      <span className="ml-2 text-sm text-gray-600">
                        {existingMedia.length +
                          (Array.isArray(data.images)
                            ? data.images.length
                            : data.images instanceof FileList
                            ? data.images.length
                            : 0)}
                        /5
                      </span>
                      {errors.images && (
                        <p className="text-red-600">{errors.images}</p>
                      )}
                    </div>

                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {imagePreview.map((src, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={src}
                              alt=""
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
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

              {/* === Step 3: Flight & Hotel Details === */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">
                    Flight & Hotel Information
                  </h3>
                  <div className="space-y-4">
                    <h4 className="font-medium">Flight Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="flight_from">Flight From *</Label>
                        <Input
                          id="flight_from"
                          placeholder="e.g., JFK"
                          value={data.flight_from}
                          onChange={(e) =>
                            setData('flight_from', e.target.value)
                          }
                          required
                        />
                        {errors.flight_from && (
                          <p className="text-red-600">{errors.flight_from}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="flight_to">Flight To *</Label>
                        <Input
                          id="flight_to"
                          placeholder="e.g., CDG"
                          value={data.flight_to}
                          onChange={(e) =>
                            setData('flight_to', e.target.value)
                          }
                          required
                        />
                        {errors.flight_to && (
                          <p className="text-red-600">{errors.flight_to}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="airline_name">Airline Name *</Label>
                        <Input
                          id="airline_name"
                          placeholder="e.g., Air France"
                          value={data.airline_name}
                          onChange={(e) =>
                            setData('airline_name', e.target.value)
                          }
                          required
                        />
                        {errors.airline_name && (
                          <p className="text-red-600">{errors.airline_name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Booking Class *</Label>
                        <Select
                          value={data.booking_class}
                          onValueChange={(value) =>
                            setData('booking_class', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="premium_economy">
                              Premium Economy
                            </SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First Class</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.booking_class && (
                          <p className="text-red-600">{errors.booking_class}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Hotel Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hotel_name">Hotel Name *</Label>
                        <Input
                          id="hotel_name"
                          placeholder="e.g., Le Meurice"
                          value={data.hotel_name}
                          onChange={(e) =>
                            setData('hotel_name', e.target.value)
                          }
                          required
                        />
                        {errors.hotel_name && (
                          <p className="text-red-600">{errors.hotel_name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Star Rating *</Label>
                        <Select
                          value={data.hotel_star_rating}
                          onValueChange={(value) =>
                            setData('hotel_star_rating', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n} Star{n > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.hotel_star_rating && (
                          <p className="text-red-600">
                            {errors.hotel_star_rating}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hotel_checkin">Check-in Date *</Label>
                        <DatePicker
                          date={hotelCheckin}
                          onSelect={(date) => {
                            setHotelCheckin(date);
                            setData("hotel_checkin", format(date!, "yyyy-MM-dd"));
                            if (hotelCheckout && isBefore(hotelCheckout, date!)) {
                              setHotelCheckout(undefined);
                              setData("hotel_checkout", "");
                            }
                          }}
                          disabledBefore={bookingStartDate}
                        />
                        {errors.hotel_checkin && (
                          <p className="text-red-600">{errors.hotel_checkin}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="hotel_checkout">Check-out Date *</Label>
                        <DatePicker
                          date={hotelCheckout}
                          onSelect={(date) => {
                            setHotelCheckout(date);
                            setData("hotel_checkout", format(date!, "yyyy-MM-dd"));
                          }}
                          disabledBefore={hotelCheckin}
                        />
                        {errors.hotel_checkout && (
                          <p className="text-red-600">
                            {errors.hotel_checkout}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 4: Settings & Policies === */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">
                    Settings & Policies
                  </h3>

                  <div className="space-y-4">
                    <h4 className="font-medium">Package Settings</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label>Visibility</Label>
                        <Select
                          value={data.visibility}
                          onValueChange={(value) =>
                            setData('visibility', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.visibility && (
                          <p className="text-red-600">{errors.visibility}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Checkbox
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(c) =>
                              setData('is_active', !!c)
                            }
                            disabled={processing}
                          />
                          <Label htmlFor="is_active" className="ml-2">
                            Active Package
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="is_featured"
                            checked={data.is_featured}
                            onCheckedChange={(c) =>
                              setData('is_featured', !!c)
                            }
                            disabled={processing}
                          />
                          <Label htmlFor="is_featured" className="ml-2">
                            Featured Package
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="is_refundable"
                            checked={data.is_refundable}
                            onCheckedChange={(c) =>
                              setData('is_refundable', !!c)
                            }
                            disabled={processing}
                          />
                          <Label htmlFor="is_refundable" className="ml-2">
                            Refundable
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Terms & Conditions</h4>
                    <div>
                      <Label htmlFor="terms_and_conditions">
                        Terms and Conditions
                      </Label>
                      <Textarea
                        id="terms_and_conditions"
                        value={data.terms_and_conditions}
                        onChange={(e) =>
                          setData('terms_and_conditions', e.target.value)
                        }
                        disabled={processing}
                      />
                      {errors.terms_and_conditions && (
                        <p className="text-red-600">
                          {errors.terms_and_conditions}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Cancellation Policy</h4>
                    <div>
                      <Label htmlFor="cancellation_policy">
                        Cancellation Policy
                      </Label>
                      <Textarea
                        id="cancellation_policy"
                        value={data.cancellation_policy}
                        onChange={(e) =>
                          setData('cancellation_policy', e.target.value)
                        }
                        disabled={processing}
                      />
                      {errors.cancellation_policy && (
                        <p className="text-red-600">
                          {errors.cancellation_policy}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900 mb-1">
                          Policy Guidelines
                        </h5>
                        <p className="text-sm text-blue-700">
                          Ensure your terms and cancellation policies are clear
                          and comply with local regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  {currentStep > 1 && (
                    <CustomButton
                      type="button"
                      onClick={prevStep}
                      disabled={processing}
                      className="btn btn-outline flex items-center space-x-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </CustomButton>
                  )}
                </div>
                <div>
                  {currentStep < 4 ? (
                    <CustomButton
                      type="button"
                      onClick={nextStep}
                      disabled={processing}
                      className="btn btn-outline bg-black flex items-center space-x-2 p-2 text-white rounded-md"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </CustomButton>
                  ) : (
                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-green-600"
                    >
                      {processing ? 'Updating…' : (
                        <>
                          <Plus className="w-4 h-4" /> Update Package
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
