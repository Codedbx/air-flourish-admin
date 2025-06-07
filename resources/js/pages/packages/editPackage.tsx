// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, useForm, usePage } from '@inertiajs/react';
// import { FormEventHandler, useEffect, useState } from 'react';
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Shield,
//   Upload,
//   Plus,
//   X,
//   Calendar,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { MultiSelect } from '@/components/multi-select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Package } from '@/types/package';
// import { toast } from 'sonner';

// const breadcrumbs: BreadcrumbItem[] = [
//   { title: 'Packages', href: '/packages' },
//   { title: 'Edit Package', href: '' },
// ];

// type EditPackagePageProps = {
//   package: {
//     id: number;
//     title: string;
//     description: string;
//     base_price: string;
//     location: string;
//     agent_addon_price: string;
//     agent_price_type: 'fixed' | 'percentage';
//     booking_start_date: string | null;
//     booking_end_date: string | null;
//     is_active: boolean;
//     is_featured: boolean;
//     is_refundable: boolean;
//     visibility: 'public' | 'private' | 'agents_only';
//     terms_and_conditions: string;
//     cancellation_policy: string;
//     flight_from: string;
//     flight_to: string;
//     airline_name: string;
//     booking_class: string;
//     hotel_name: string;
//     hotel_star_rating: number;
//     hotel_checkin: string | null;
//     hotel_checkout: string | null;
//     activities: number[];
//   };
//   allActivities: { id: number; title: string; price: number }[];
//   images: unknown; // could be an array or a {"Illuminate\\Support\\Collection": [...] }
// };

// export default function EditPackage() {
//   const { package: pkg, allActivities, images: rawImages } =
//     usePage<EditPackagePageProps>().props;

//   // Normalize incoming "images" prop into a simple array
//   const initialMedia: { id: number; url: string; thumbnail: string }[] = (() => {
//     if (Array.isArray(rawImages)) {
//       return rawImages as any;
//     }
//     const key = 'Illuminate\\Support\\Collection';
//     if (
//       rawImages &&
//       typeof rawImages === 'object' &&
//       Array.isArray((rawImages as any)[key])
//     ) {
//       return (rawImages as any)[key];
//     }
//     return [];
//   })();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [existingMedia, setExistingMedia] = useState(initialMedia);
//   const [imagePreview, setImagePreview] = useState<string[]>([]);
//   const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);

//   const {
//     data,
//     setData,
//     put,
//     processing,
//     errors,
//     setError,
//     clearErrors,
//     progress,
//   } = useForm<Omit<Package, 'id'>>({
//     title: pkg.title,
//     description: pkg.description,
//     base_price: pkg.base_price,
//     location: pkg.location,
//     agent_addon_price: pkg.agent_addon_price,
//     agent_price_type: pkg.agent_price_type,
//     booking_start_date: pkg.booking_start_date
//       ? pkg.booking_start_date.substring(0, 10)
//       : '',
//     booking_end_date: pkg.booking_end_date
//       ? pkg.booking_end_date.substring(0, 10)
//       : '',
//     is_active: pkg.is_active,
//     is_featured: pkg.is_featured,
//     is_refundable: pkg.is_refundable,
//     visibility: pkg.visibility,
//     terms_and_conditions: pkg.terms_and_conditions,
//     cancellation_policy: pkg.cancellation_policy,
//     flight_from: pkg.flight_from,
//     flight_to: pkg.flight_to,
//     airline_name: pkg.airline_name,
//     booking_class: pkg.booking_class,
//     hotel_name: pkg.hotel_name,
//     hotel_star_rating: pkg.hotel_star_rating.toString(),
//     hotel_checkin: pkg.hotel_checkin
//       ? pkg.hotel_checkin.substring(0, 10)
//       : '',
//     hotel_checkout: pkg.hotel_checkout
//       ? pkg.hotel_checkout.substring(0, 10)
//       : '',
//     activities: pkg.activities.map((a) => a.id),
//     images: [] as File[],
//     delete_media: [] as number[],
//   });

//   const stepFieldMap: Record<string, number> = {
//     title: 1,
//     description: 1,
//     base_price: 1,
//     location: 1,
//     agent_addon_price: 1,
//     agent_price_type: 1,
//     images: 2,
//     delete_media: 2,
//     flight_from: 3,
//     flight_to: 3,
//     airline_name: 3,
//     booking_class: 3,
//     hotel_name: 3,
//     hotel_star_rating: 3,
//     hotel_checkin: 3,
//     hotel_checkout: 3,
//     visibility: 4,
//     terms_and_conditions: 4,
//     cancellation_policy: 4,
//     is_active: 4,
//     is_featured: 4,
//     is_refundable: 4,
//   };

//   const activityOptions = allActivities.map((activity) => ({
//     label: `${activity.title} - $${activity.price}`,
//     value: activity.id.toString(),
//   }));

//   const isStepValid = (step: number): boolean => {
//     switch (step) {
//       case 1:
//         return (
//           !!data.title.trim() &&
//           !!data.description.trim() &&
//           !!data.base_price &&
//           !!data.location.trim() &&
//           !!data.agent_addon_price &&
//           !!data.agent_price_type.trim()
//         );
//       case 2: {
//         const totalCount = existingMedia.length + data.images.length;
//         return totalCount >= 5 && totalCount <= 6;
//       }
//       case 3:
//         return true;
//       case 4:
//         return !!data.visibility;
//       default:
//         return false;
//     }
//   };

//   const nextStep = () => {
//     clearErrors('images');
//     if (!isStepValid(currentStep)) {
//       toast.error('Please complete all required fields before continuing.');
//       return;
//     }
//     setCurrentStep((prev) => Math.min(prev + 1, 4));
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearErrors('images');

//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     const currentCount = existingMedia.length + data.images.length;
//     const remainingSlots = 6 - currentCount;
//     const filesToAdd = files.slice(0, remainingSlots);

//     const oversized = filesToAdd.filter((file) => file.size > 1024 * 1024);
//     if (oversized.length > 0) {
//       setError('images', 'Each image must be less than 1MB.');
//       return;
//     }

//     const newTotal = currentCount + filesToAdd.length;
//     if (newTotal > 6) {
//       setError('images', 'You can only have a maximum of 6 images.');
//       return;
//     }

//     setData('images', [...data.images, ...filesToAdd]);
//     const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
//     setImagePreview((prev) => [...prev, ...newPreviews]);
//   };

//   const removeNewImage = (index: number) => {
//     const updatedFiles = data.images.filter((_, i) => i !== index);
//     const updatedPreviews = imagePreview.filter((_, i) => i !== index);

//     URL.revokeObjectURL(imagePreview[index]);
//     setData('images', updatedFiles);
//     setImagePreview(updatedPreviews);

//     const totalCount = existingMedia.length + updatedFiles.length;
//     if (totalCount < 5) {
//       setError('images', 'A minimum of 5 images is required.');
//     } else {
//       clearErrors('images');
//     }
//   };

//   const removeExistingImage = (index: number) => {
//     const mediaToRemove = existingMedia[index];
//     const updatedExisting = existingMedia.filter((_, i) => i !== index);

//     setExistingMedia(updatedExisting);
//     setDeletedMediaIds((prev) => [...prev, mediaToRemove.id]);

//     const totalCount = updatedExisting.length + data.images.length;
//     if (totalCount < 5) {
//       setError('images', 'A minimum of 5 images is required.');
//     } else {
//       clearErrors('images');
//     }
//   };

//   const handleActivityChange = (selectedValues: string[]) => {
//     const activityIds = selectedValues.map((v) => parseInt(v, 10));
//     setData('activities', activityIds);
//   };

//   const submit: FormEventHandler = (e) => {
//     e.preventDefault();
//     clearErrors('images');

//     if (!isStepValid(4)) {
//       toast.error('Final step incomplete. Please review required fields.');
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (key === 'images') {
//         (value as File[]).forEach((file, i) =>
//           formData.append(`images[${i}]`, file)
//         );
//       } else if (key === 'activities') {
//         (value as number[]).forEach((id, i) =>
//           formData.append(`activities[${i}]`, id.toString())
//         );
//       } else if (key === 'delete_media') {
//         (value as number[]).forEach((id, i) =>
//           formData.append(`delete_media[${i}]`, id.toString())
//         );
//       } else if (typeof value === 'boolean') {
//         formData.append(key, value ? '1' : '0');
//       } else if (value !== null && value !== undefined) {
//         formData.append(key, value.toString());
//       }
//     });

//     if (deletedMediaIds.length > 0) {
//       deletedMediaIds.forEach((id, i) =>
//         formData.append(`delete_media[${i}]`, id.toString())
//       );
//     }

//     put(route('packages.update', pkg.id), {
//       forceFormData: true,
//       preserveScroll: true,
//       preserveState: 'errors',
//       onSuccess: () => {
//         toast.success('Package updated successfully!');
//       },
//       onError: (errors) => {
//         const fields = Object.keys(errors);
//         const firstErrorStep = Math.min(
//           ...fields.map((f) => stepFieldMap[f] || 1)
//         );
//         setCurrentStep(firstErrorStep);
//         toast.error('There were validation errors. Please review the form.');
//       },
//     });
//   };

//   useEffect(() => {
//     return () => {
//       imagePreview.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreview]);

//   const steps = [
//     { number: 1, title: 'Basic Information' },
//     { number: 2, title: 'Package Activities & Media' },
//     { number: 3, title: 'Flight & Hotel Details' },
//     { number: 4, title: 'Settings & Policies' },
//   ];

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Edit Package" />
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//         <Card className="w-full mx-auto">
//           <CardHeader className="bg-gray-50 border-b">
//             <CardTitle className="text-xl font-medium text-gray-900 mb-4">
//               Edit Travel Package
//             </CardTitle>
//             <div className="flex items-center justify-between">
//               {steps.map((step, idx) => (
//                 <div key={step.number} className="flex items-center">
//                   <div
//                     className={`
//                       flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
//                       ${
//                         currentStep >= step.number
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-200 text-gray-600'
//                       }
//                     `}
//                   >
//                     {step.number}
//                   </div>
//                   <span
//                     className={`
//                       ml-2 text-sm font-medium hidden sm:inline
//                       ${
//                         currentStep >= step.number
//                           ? 'text-blue-600'
//                           : 'text-gray-500'
//                       }
//                     `}
//                   >
//                     {step.title}
//                   </span>
//                   {idx < steps.length - 1 && (
//                     <div
//                       className={`
//                         w-8 sm:w-16 h-0.5 mx-2 sm:mx-4
//                         ${
//                           currentStep > step.number
//                             ? 'bg-blue-600'
//                             : 'bg-gray-200'
//                         }
//                       `}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {progress && (
//               <div className="mt-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-600">
//                     Uploading package...
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     {Math.round(progress.percentage || 0)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${progress.percentage || 0}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </CardHeader>

//           <CardContent className="p-6">
//             <form onSubmit={submit}>
//               {/* ----------- Step 1: Basic Information ----------- */}
//               {currentStep === 1 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Basic Package Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="title"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Package Title *
//                       </Label>
//                       <Input
//                         id="title"
//                         placeholder="e.g., Luxury Paris Getaway"
//                         value={data.title}
//                         onChange={(e) => setData('title', e.target.value)}
//                         className="w-full"
//                         required
//                       />
//                       {errors.title && (
//                         <p className="text-sm text-red-600">{errors.title}</p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="description"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Description *
//                       </Label>
//                       <Textarea
//                         id="description"
//                         placeholder="e.g., 5-day luxury package with Eiffel Tower access"
//                         value={data.description}
//                         onChange={(e) => setData('description', e.target.value)}
//                         className="w-full min-h-[80px] resize-none"
//                         required
//                       />
//                       {errors.description && (
//                         <p className="text-sm text-red-600">
//                           {errors.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="base_price"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Base Price ($) *
//                       </Label>
//                       <Input
//                         id="base_price"
//                         placeholder="e.g., 2999.99"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={data.base_price}
//                         onChange={(e) => setData('base_price', e.target.value)}
//                         className="w-full"
//                         required
//                       />
//                       {errors.base_price && (
//                         <p className="text-sm text-red-600">
//                           {errors.base_price}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="location"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Location *
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="location"
//                           placeholder="e.g., Paris, France"
//                           value={data.location}
//                           onChange={(e) => setData('location', e.target.value)}
//                           className="w-full pr-10"
//                           required
//                         />
//                         <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.location && (
//                         <p className="text-sm text-red-600">{errors.location}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="agent_addon_price"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Agent Addon Price *
//                       </Label>
//                       <Input
//                         id="agent_addon_price"
//                         placeholder="e.g., 299.99 or 15 (for percentage)"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={data.agent_addon_price}
//                         onChange={(e) =>
//                           setData('agent_addon_price', e.target.value)
//                         }
//                         className="w-full"
//                         required
//                       />
//                       {errors.agent_addon_price && (
//                         <p className="text-sm text-red-600">
//                           {errors.agent_addon_price}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">
//                         Agent Price Type *
//                       </Label>
//                       <Select
//                         value={data.agent_price_type}
//                         onValueChange={(value) =>
//                           setData('agent_price_type', value)
//                         }
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="fixed">
//                             Fixed Amount ($)
//                           </SelectItem>
//                           <SelectItem value="percentage">
//                             Percentage (%)
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       {errors.agent_price_type && (
//                         <p className="text-sm text-red-600">
//                           {errors.agent_price_type}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_start_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking Start Date
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_start_date"
//                           type="date"
//                           value={data.booking_start_date}
//                           onChange={(e) =>
//                             setData('booking_start_date', e.target.value)
//                           }
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_start_date && (
//                         <p className="text-sm text-red-600">
//                           {errors.booking_start_date}
//                         </p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_end_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking End Date
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_end_date"
//                           type="date"
//                           value={data.booking_end_date}
//                           onChange={(e) =>
//                             setData('booking_end_date', e.target.value)
//                           }
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_end_date && (
//                         <p className="text-sm text-red-600">
//                           {errors.booking_end_date}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ----------- Step 2: Activities & Media ----------- */}
//               {currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Package Activities
//                     </h3>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">
//                         Select Activities
//                       </Label>
//                       <MultiSelect
//                         options={activityOptions}
//                         value={data.activities.map((id) => id.toString())}
//                         onValueChange={handleActivityChange}
//                         placeholder="Select activities for this package"
//                         variant="inverted"
//                         maxCount={3}
//                       />
//                       <p className="text-sm text-gray-500">
//                         Choose activities included in this package.
//                       </p>
//                       {errors.activities && (
//                         <p className="text-sm text-red-600">
//                           {errors.activities}
//                         </p>
//                       )}
//                     </div>

//                     {data.activities.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">
//                           Selected Activities:
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {data.activities.map((activityId, index) => {
                            
//                             const activity = allActivities.find(
//                               (a) => a.id === activityId
//                             );
//                             return (
//                               <div
//                                 key={index}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                               >
//                                 {activity
//                                   ? `${activity.title} - $${activity.price}`
//                                   : `Activity #${activityId}`}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     const newActivities = data.activities.filter(
//                                       (id) => id !== activityId
//                                     );
//                                     setData('activities', newActivities);
//                                   }}
//                                   className="ml-2 text-blue-600 hover:text-blue-800"
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <Separator className="my-6" />

//                   <div className="space-y-6">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Package Media
//                     </h3>
//                     <div
//                       className={`space-y-2 ${
//                         errors.images ? 'border border-red-500 p-2 rounded-md' : ''
//                       }`}
//                     >
//                       <Label className="text-sm font-medium text-gray-700">
//                         Package Images (5–6 images, max 1MB each)
//                       </Label>
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
//                           multiple
//                           onChange={handleImageUpload}
//                           className="hidden"
//                           id="image-upload"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             document.getElementById('image-upload')?.click();
//                           }}
//                           className="flex items-center gap-2"
//                           disabled={
//                             existingMedia.length + data.images.length >= 6 || processing
//                           }
//                         >
//                           <Upload className="w-4 h-4" />
//                           Upload Images
//                         </Button>
//                         <p className="text-sm text-gray-500">
//                           {existingMedia.length + data.images.length}/6
//                         </p>
//                       </div>
//                       {errors.images && (
//                         <p className="text-sm text-red-600">{errors.images}</p>
//                       )}
//                     </div>

//                     {/* Existing images */}
//                     {existingMedia.length > 0 && (
//                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {existingMedia.map((media, idx) => (
//                           <div key={media.id} className="relative group">
//                             <img
//                               src={media.url}
//                               alt={`Existing ${idx + 1}`}
//                               className="w-full h-24 object-cover rounded-lg border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeExistingImage(idx)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {/* Previews for newly added images */}
//                     {imagePreview.length > 0 && (
//                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {imagePreview.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={preview}
//                               alt={`Preview ${index + 1}`}
//                               className="w-full h-24 object-cover rounded-lg border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeNewImage(index)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* ----------- Step 3: Flight & Hotel Details ----------- */}
//               {currentStep === 3 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Flight & Hotel Information
//                   </h3>
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Flight Details (Optional)
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="flight_from"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Flight From
//                         </Label>
//                         <Input
//                           id="flight_from"
//                           placeholder="e.g., New York (JFK)"
//                           value={data.flight_from}
//                           onChange={(e) => setData('flight_from', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.flight_from && (
//                           <p className="text-sm text-red-600">{errors.flight_from}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="flight_to"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Flight To
//                         </Label>
//                         <Input
//                           id="flight_to"
//                           placeholder="e.g., Paris (CDG)"
//                           value={data.flight_to}
//                           onChange={(e) => setData('flight_to', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.flight_to && (
//                           <p className="text-sm text-red-600">{errors.flight_to}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="airline_name"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Airline Name
//                         </Label>
//                         <Input
//                           id="airline_name"
//                           placeholder="e.g., Air France"
//                           value={data.airline_name}
//                           onChange={(e) => setData('airline_name', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.airline_name && (
//                           <p className="text-sm text-red-600">{errors.airline_name}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="booking_class"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Booking Class
//                         </Label>
//                         <Select
//                           value={data.booking_class}
//                           onValueChange={(value) => setData('booking_class', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select class" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="economy">Economy</SelectItem>
//                             <SelectItem value="premium_economy">
//                               Premium Economy
//                             </SelectItem>
//                             <SelectItem value="business">Business</SelectItem>
//                             <SelectItem value="first">First Class</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.booking_class && (
//                           <p className="text-sm text-red-600">{errors.booking_class}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">
//                       Hotel Details (Optional)
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_name"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Name
//                         </Label>
//                         <Input
//                           id="hotel_name"
//                           placeholder="e.g., Le Meurice"
//                           value={data.hotel_name}
//                           onChange={(e) => setData('hotel_name', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.hotel_name && (
//                           <p className="text-sm text-red-600">{errors.hotel_name}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_star_rating"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Star Rating
//                         </Label>
//                         <Select
//                           value={data.hotel_star_rating}
//                           onValueChange={(value) => setData('hotel_star_rating', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select rating" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="1">1 Star</SelectItem>
//                             <SelectItem value="2">2 Stars</SelectItem>
//                             <SelectItem value="3">3 Stars</SelectItem>
//                             <SelectItem value="4">4 Stars</SelectItem>
//                             <SelectItem value="5">5 Stars</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.hotel_star_rating && (
//                           <p className="text-sm text-red-600">
//                             {errors.hotel_star_rating}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_checkin"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Check-in Date
//                         </Label>
//                         <div className="relative">
//                           <Input
//                             id="hotel_checkin"
//                             type="date"
//                             value={data.hotel_checkin}
//                             onChange={(e) => setData('hotel_checkin', e.target.value)}
//                             className="w-full pr-10"
//                           />
//                           <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         </div>
//                         {errors.hotel_checkin && (
//                           <p className="text-sm text-red-600">{errors.hotel_checkin}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label
//                           htmlFor="hotel_checkout"
//                           className="text-sm font-medium text-gray-700"
//                         >
//                           Hotel Check-out Date
//                         </Label>
//                         <div className="relative">
//                           <Input
//                             id="hotel_checkout"
//                             type="date"
//                             value={data.hotel_checkout}
//                             onChange={(e) => setData('hotel_checkout', e.target.value)}
//                             className="w-full pr-10"
//                           />
//                           <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         </div>
//                         {errors.hotel_checkout && (
//                           <p className="text-sm text-red-600">{errors.hotel_checkout}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ----------- Step 4: Settings & Policies ----------- */}
//               {currentStep === 4 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Settings & Policies
//                   </h3>
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Package Settings</h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">
//                           Visibility
//                         </Label>
//                         <Select
//                           value={data.visibility}
//                           onValueChange={(value) => setData('visibility', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select visibility" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="public">
//                               Public - Visible to everyone
//                             </SelectItem>
//                             <SelectItem value="private">
//                               Private - Only visible to you
//                             </SelectItem>
//                             <SelectItem value="agents_only">
//                               Agents Only - Visible to agents
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.visibility && (
//                           <p className="text-sm text-red-600">{errors.visibility}</p>
//                         )}
//                       </div>

//                       <div className="space-y-4">
//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_active"
//                             checked={data.is_active}
//                             onCheckedChange={(checked) => setData('is_active', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label
//                             htmlFor="is_active"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Active Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Package is available for booking
//                         </p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_featured"
//                             checked={data.is_featured}
//                             onCheckedChange={(checked) => setData('is_featured', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label
//                             htmlFor="is_featured"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Featured Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Display in featured packages section
//                         </p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_refundable"
//                             checked={data.is_refundable}
//                             onCheckedChange={(checked) => setData('is_refundable', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label
//                             htmlFor="is_refundable"
//                             className="text-sm font-medium text-gray-700"
//                           >
//                             Refundable
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">
//                           Allow refunds for this package
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Terms & Conditions</h4>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="terms_and_conditions"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Terms and Conditions
//                       </Label>
//                       <Textarea
//                         id="terms_and_conditions"
//                         placeholder="Enter terms and conditions for this package..."
//                         value={data.terms_and_conditions}
//                         onChange={(e) =>
//                           setData('terms_and_conditions', e.target.value)
//                         }
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Include important terms, conditions, and requirements for this package
//                       </p>
//                       {errors.terms_and_conditions && (
//                         <p className="text-sm text-red-600">
//                           {errors.terms_and_conditions}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Cancellation Policy</h4>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="cancellation_policy"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Cancellation Policy
//                       </Label>
//                       <Textarea
//                         id="cancellation_policy"
//                         placeholder="Enter cancellation policy for this package..."
//                         value={data.cancellation_policy}
//                         onChange={(e) =>
//                           setData('cancellation_policy', e.target.value)
//                         }
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Define cancellation terms, deadlines, and refund policies
//                       </p>
//                       {errors.cancellation_policy && (
//                         <p className="text-sm text-red-600">
//                           {errors.cancellation_policy}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-start space-x-3">
//                       <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
//                       <div>
//                         <h5 className="text-sm font-medium text-blue-900 mb-1">
//                           Policy Guidelines
//                         </h5>
//                         <p className="text-sm text-blue-700">
//                           Ensure your terms and cancellation policies are clear and comply with
//                           local regulations. Include details about booking changes, refund
//                           timelines, and any non‐refundable fees.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <div className="flex items-center justify-between pt-6 border-t border-gray-200">
//                 <div className="flex items-center space-x-2">
//                   {currentStep > 1 && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={prevStep}
//                       className="flex items-center space-x-2"
//                       disabled={processing}
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       <span>Previous</span>
//                     </Button>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   {currentStep < 4 ? (
//                     <div
//                       onClick={nextStep}
//                       role="button"
//                       tabIndex={0}
//                       className={`inline-flex items-center space-x-2 px-4 py-2 rounded text-white ${
//                         processing
//                           ? 'bg-gray-400 cursor-not-allowed'
//                           : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
//                       }`}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           e.preventDefault();
//                           nextStep();
//                         }
//                       }}
//                     >
//                       {processing && (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       )}
//                       <span>Next</span>
//                       <ChevronRight className="w-4 h-4" />
//                     </div>
//                   ) : (
//                     <Button
//                       type="submit"
//                       disabled={processing}
//                       className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
//                     >
//                       {processing ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           <span>Updating...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Plus className="w-4 h-4" />
//                           <span>Update Package</span>
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// }

// resources/js/Pages/Packages/EditPackage.tsx

// import React, { useEffect, useState } from 'react';
// import { Head, useForm, usePage, router } from '@inertiajs/react';
// import {
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Shield,
//   Upload,
//   Plus,
//   X,
//   Calendar,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Checkbox } from '@/components/ui/checkbox';
// import { MultiSelect } from '@/components/multi-select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';
// import AppLayout from '@/layouts/app-layout';

// // 1. Define exactly what fields the form will send.
// export interface EditPackageForm {
//   title: string;
//   description: string;
//   base_price: string;
//   location: string;
//   agent_addon_price: string;
//   agent_price_type: 'fixed' | 'percentage';
//   booking_start_date: string;
//   booking_end_date: string;
//   is_active: boolean;
//   is_featured: boolean;
//   is_refundable: boolean;
//   visibility: 'public' | 'private';
//   terms_and_conditions: string;
//   cancellation_policy: string;
//   flight_from: string;
//   flight_to: string;
//   airline_name: string;
//   booking_class: string;
//   hotel_name: string;
//   hotel_star_rating: string;
//   hotel_checkin: string;
//   hotel_checkout: string;
//   activities: number[];
//   images: File[];
//   [key: string]: any;
// }

// type EditPackagePageProps = {
//   package: {
//     id: number;
//     title: string;
//     description: string;
//     base_price: string;
//     location: string;
//     agent_addon_price: string;
//     agent_price_type: string;
//     booking_start_date: string | null;
//     booking_end_date: string | null;
//     is_active: boolean;
//     is_featured: boolean;
//     is_refundable: boolean;
//     visibility: string;
//     terms_and_conditions: string | null;
//     cancellation_policy: string | null;
//     flight_from: string | null;
//     flight_to: string | null;
//     airline_name: string | null;
//     booking_class: string | null;
//     hotel_name: string | null;
//     hotel_star_rating: number | null;
//     hotel_checkin: string | null;
//     hotel_checkout: string | null;
//     activities: { id: number; title: string; price: string }[];
//   };
//   allActivities: { id: number; title: string; price: number }[];
//   images: { id: number; url: string; thumbnail: string }[];
//   flash: { success?: string };
// };

// export default function EditPackage() {
//   const { package: pkg, allActivities, images: incomingImages, flash } =
//     usePage<EditPackagePageProps>().props;

//   // 2. Keep “existing” images in state so removing them disappears immediately
//   const [existingMedia, setExistingMedia] = useState<
//     { id: number; url: string; thumbnail: string }[]
//   >(incomingImages);

//   // 3. New File‐objects → preview URLs
//   const [imagePreview, setImagePreview] = useState<string[]>([]);

//   // 4. IDs of existing media the user clicked “X” on
//   const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);

//   // 5. Inertia form with all other fields
//   const { data, setData, put, processing, errors, setError, clearErrors, progress } =
//     useForm<EditPackageForm>({
//       title: pkg.title || '',
//       description: pkg.description || '',
//       base_price: pkg.base_price || '',
//       location: pkg.location || '',
//       agent_addon_price: pkg.agent_addon_price || '',
//       agent_price_type: pkg.agent_price_type as 'fixed' | 'percentage',
//       booking_start_date:
//         pkg.booking_start_date?.split('T')[0] || '', // "YYYY-MM-DD"
//       booking_end_date: pkg.booking_end_date?.split('T')[0] || '',
//       is_active: pkg.is_active,
//       is_featured: pkg.is_featured,
//       is_refundable: pkg.is_refundable,
//       visibility: pkg.visibility as 'public' | 'private',
//       terms_and_conditions: pkg.terms_and_conditions || '',
//       cancellation_policy: pkg.cancellation_policy || '',
//       flight_from: pkg.flight_from || '',
//       flight_to: pkg.flight_to || '',
//       airline_name: pkg.airline_name || '',
//       booking_class: pkg.booking_class || '',
//       hotel_name: pkg.hotel_name || '',
//       hotel_star_rating:
//         pkg.hotel_star_rating !== null ? pkg.hotel_star_rating.toString() : '',
//       hotel_checkin: pkg.hotel_checkin?.split('T')[0] || '',
//       hotel_checkout: pkg.hotel_checkout?.split('T')[0] || '',
//       activities: pkg.activities.map((a) => a.id),
//       images: [], // no preloaded File objects
//     });

//   // 6. If Laravel flashes success, toast + redirect back
//   useEffect(() => {
//     if (flash.success) {
//       toast.success(flash.success);
//       router.visit(route('packages.index'));
//     }
//   }, [flash.success]);

//   // 7. Map field names → step numbers
//   const stepFieldMap: Record<string, number> = {
//     title: 1,
//     description: 1,
//     base_price: 1,
//     location: 1,
//     agent_addon_price: 1,
//     agent_price_type: 1,
//     images: 2,
//     activities: 2,
//     flight_from: 3,
//     flight_to: 3,
//     airline_name: 3,
//     booking_class: 3,
//     hotel_name: 3,
//     hotel_star_rating: 3,
//     hotel_checkin: 3,
//     hotel_checkout: 3,
//     visibility: 4,
//     terms_and_conditions: 4,
//     cancellation_policy: 4,
//     is_active: 4,
//     is_featured: 4,
//     is_refundable: 4,
//   };

//   // 8. MultiSelect options
//   const activityOptions = allActivities.map((activity) => ({
//     label: `${activity.title} - $${activity.price}`,
//     value: activity.id.toString(),
//   }));

//   // 9. Step validation logic
//   const isStepValid = (step: number): boolean => {
//     switch (step) {
//       case 1:
//         return (
//           !!data.title.trim() &&
//           !!data.description.trim() &&
//           !!data.base_price &&
//           !!data.location.trim() &&
//           !!data.agent_addon_price &&
//           !!data.agent_price_type.trim()
//         );
//       case 2: {
//         const existingCount = existingMedia.length;
//         const newCount = data.images.length;
//         const total = existingCount + newCount;
//         return total >= 5 && total <= 6;
//       }
//       case 3:
//         return true; // flight/hotel are optional
//       case 4:
//         return !!data.visibility;
//       default:
//         return false;
//     }
//   };

//   const [currentStep, setCurrentStep] = useState(1);

//   const nextStep = () => {
//     clearErrors('images');
//     if (!isStepValid(currentStep)) {
//       if (currentStep === 2) {
//         toast.error('After removing/adding, you must have 5–6 images total.');
//       } else {
//         toast.error('Please complete all required fields before continuing.');
//       }
//       return;
//     }
//     setCurrentStep((prev) => Math.min(prev + 1, 4));
//   };

//   const prevStep = () => {
//     if (currentStep > 1) setCurrentStep((prev) => prev - 1);
//   };

//   // 10. Handle new file uploads (max 6 total, ≤1 MB each)
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearErrors('images');

//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     const existingCount = existingMedia.length;
//     const currentCount = existingCount + data.images.length;
//     const remainingSlots = 6 - currentCount;
//     const filesToAdd = files.slice(0, remainingSlots);

//     // Enforce ≤1 MB
//     const oversized = filesToAdd.filter((file) => file.size > 1024 * 1024);
//     if (oversized.length > 0) {
//       setError('images', 'Each new image must be under 1 MB.');
//       return;
//     }

//     const newTotal = existingCount + data.images.length + filesToAdd.length;
//     if (newTotal > 6) {
//       setError('images', 'You can only have up to 6 images total.');
//       return;
//     }

//     // Append new files to state
//     setData('images', [...data.images, ...filesToAdd]);
//     // Create blob URLs for preview
//     const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
//     setImagePreview((prev) => [...prev, ...newPreviews]);
//   };

//   // 11. Remove one of the newly added File objects (not yet on server)
//   const removeNewImage = (index: number) => {
//     const updatedFiles = data.images.filter((_, i) => i !== index);
//     const updatedPreviews = imagePreview.filter((_, i) => i !== index);

//     URL.revokeObjectURL(imagePreview[index]);
//     setData('images', updatedFiles);
//     setImagePreview(updatedPreviews);

//     const totalCount = existingMedia.length + updatedFiles.length;
//     if (totalCount < 5) {
//       setError('images', 'A minimum of 5 images is required.');
//     } else {
//       clearErrors('images');
//     }
//   };

//   // 12. Remove one of the existing media files immediately
//   const removeExistingImage = (idx: number) => {
//     const mediaToRemove = existingMedia[idx];
//     const updatedExisting = existingMedia.filter((_, i) => i !== idx);

//     setExistingMedia(updatedExisting);
//     setDeletedMediaIds((prev) => [...prev, mediaToRemove.id]);

//     const totalCount = updatedExisting.length + data.images.length;
//     if (totalCount < 5) {
//       setError('images', 'A minimum of 5 images is required.');
//     } else {
//       clearErrors('images');
//     }
//   };

//   const handleActivityChange = (selectedValues: string[]) => {
//     const activityIds = selectedValues.map((v) => parseInt(v, 10));
//     setData('activities', activityIds);
//   };

//   // 13. Final submit: build a FormData, append "_method=PUT", then Inertia.post(...)
//   const submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     clearErrors('images');

//     if (!isStepValid(4)) {
//       toast.error('Final step incomplete. Please review required fields.');
//       return;
//     }

//     const formData = new FormData();
//     // Copy all primitive/array fields
//     // Object.entries(data).forEach(([key, value]) => {
//     //   if (key === 'images') {
//     //     (value as File[]).forEach((file, i) => {
//     //       formData.append(`images[${i}]`, file);
//     //     });
//     //   } else if (key === 'activities') {
//     //     (value as number[]).forEach((id, i) => {
//     //       formData.append(`activities[${i}]`, id.toString());
//     //     });
//     //   } else if (typeof value === 'boolean') {
//     //     formData.append(key, value ? '1' : '0');
//     //   } else if (value !== null && value !== undefined) {
//     //     formData.append(key, value.toString());
//     //   }
//     // });

//     // Append the deleted‐media IDs under delete_media[]
//     deletedMediaIds.forEach((id, i) => {
//       formData.append(`delete_media[${i}]`, id.toString());
//     });

//     // **CRUCIAL**: Laravel needs `_method=PUT` in a multipart request
//     // formData.append('_method', 'PUT');

//     // Log every FormData entry
//     // for (const [field, val] of formData.entries()) {
//     //   if (val instanceof File) {
//     //     console.log(field, '→', val.name);
//     //   } else {
//     //     console.log(field, '→', val);
//     //   }
//     // }

//     // Use Inertia.post(...) instead of .put(...) so that Laravel sees POST + _method=PUT
//     put(route('packages.update', pkg.id), {
//       preserveScroll: true,
//       preserveState: 'errors',
//       onSuccess: () => {
//         toast.success('Package updated successfully!');
//         // Laravel will flash success + redirect; our useEffect picks it up.
//       },
//       onError: (errs) => {
//         const fields = Object.keys(errs);
//         const firstErrorStep = Math.min(
//           ...fields.map((f) => stepFieldMap[f] || 1)
//         );
//         setCurrentStep(firstErrorStep);
//         toast.error('There were validation errors. Please review the form.');
//       },
//     });
//   };

//   // 14. Clean up blob URLs on unmount
//   useEffect(() => {
//     return () => {
//       imagePreview.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreview]);

//   const steps = [
//     { number: 1, title: 'Basic Information' },
//     { number: 2, title: 'Activities & Media' },
//     { number: 3, title: 'Flight & Hotel Details' },
//     { number: 4, title: 'Settings & Policies' },
//   ];

//   return (
//     <AppLayout
//       breadcrumbs={[
//         { title: 'Packages', href: '/packages' },
//         { title: 'Edit Package', href: `/packages/${pkg.id}/edit` },
//       ]}
//     >
//       <Head title="Edit Package" />
//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//         <Card className="w-full mx-auto">
//           <CardHeader className="bg-gray-50 border-b">
//             <CardTitle className="text-xl font-medium text-gray-900 mb-4">
//               Edit Package
//             </CardTitle>
//             <div className="flex items-center justify-between">
//               {steps.map((step, idx) => (
//                 <div key={step.number} className="flex items-center">
//                   <div
//                     className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
//                       currentStep >= step.number
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-600'
//                     }`}
//                   >
//                     {step.number}
//                   </div>
//                   <span
//                     className={`ml-2 text-sm font-medium hidden sm:inline ${
//                       currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
//                     }`}
//                   >
//                     {step.title}
//                   </span>
//                   {idx < steps.length - 1 && (
//                     <div
//                       className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
//                         currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
//                       }`}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {progress && (
//               <div className="mt-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm text-gray-600">Uploading package…</span>
//                   <span className="text-sm text-gray-600">
//                     {Math.round(progress.percentage || 0)}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${progress.percentage || 0}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </CardHeader>

//           <CardContent className="p-6">
//             <form onSubmit={submit}>
//               {/* === Step 1: Basic Information === */}
//               {currentStep === 1 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Basic Package Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="title" className="text-sm font-medium text-gray-700">
//                         Package Title *
//                       </Label>
//                       <Input
//                         id="title"
//                         placeholder="e.g., Luxury Paris Getaway"
//                         value={data.title}
//                         onChange={(e) => setData('title', e.target.value)}
//                         className="w-full"
//                         required
//                       />
//                       {errors.title && (
//                         <p className="text-sm text-red-600">{errors.title}</p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="description" className="text-sm font-medium text-gray-700">
//                         Description *
//                       </Label>
//                       <Textarea
//                         id="description"
//                         placeholder="e.g., 5-day luxury package with Eiffel Tower access"
//                         value={data.description}
//                         onChange={(e) => setData('description', e.target.value)}
//                         className="w-full min-h-[80px] resize-none"
//                         required
//                       />
//                       {errors.description && (
//                         <p className="text-sm text-red-600">{errors.description}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="base_price" className="text-sm font-medium text-gray-700">
//                         Base Price ($) *
//                       </Label>
//                       <Input
//                         id="base_price"
//                         placeholder="e.g., 2999.99"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={data.base_price}
//                         onChange={(e) => setData('base_price', e.target.value)}
//                         className="w-full"
//                         required
//                       />
//                       {errors.base_price && (
//                         <p className="text-sm text-red-600">{errors.base_price}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="location" className="text-sm font-medium text-gray-700">
//                         Location *
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="location"
//                           placeholder="e.g., Paris, France"
//                           value={data.location}
//                           onChange={(e) => setData('location', e.target.value)}
//                           className="w-full pr-10"
//                           required
//                         />
//                         <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.location && (
//                         <p className="text-sm text-red-600">{errors.location}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="agent_addon_price"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Agent Addon Price *
//                       </Label>
//                       <Input
//                         id="agent_addon_price"
//                         placeholder="e.g., 299.99 or 15 (for percentage)"
//                         type="number"
//                         step="0.01"
//                         min="0"
//                         value={data.agent_addon_price}
//                         onChange={(e) => setData('agent_addon_price', e.target.value)}
//                         className="w-full"
//                         required
//                       />
//                       {errors.agent_addon_price && (
//                         <p className="text-sm text-red-600">{errors.agent_addon_price}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">Agent Price Type *</Label>
//                       <Select
//                         value={data.agent_price_type}
//                         onValueChange={(value) => setData('agent_price_type', value)}
//                       >
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
//                           <SelectItem value="percentage">Percentage (%)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       {errors.agent_price_type && (
//                         <p className="text-sm text-red-600">{errors.agent_price_type}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_start_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking Start Date
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_start_date"
//                           type="date"
//                           value={data.booking_start_date}
//                           onChange={(e) => setData('booking_start_date', e.target.value)}
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_start_date && (
//                         <p className="text-sm text-red-600">{errors.booking_start_date}</p>
//                       )}
//                     </div>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="booking_end_date"
//                         className="text-sm font-medium text-gray-700"
//                       >
//                         Booking End Date
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="booking_end_date"
//                           type="date"
//                           value={data.booking_end_date}
//                           onChange={(e) => setData('booking_end_date', e.target.value)}
//                           className="w-full pr-10"
//                         />
//                         <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       </div>
//                       {errors.booking_end_date && (
//                         <p className="text-sm text-red-600">{errors.booking_end_date}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* === Step 2: Activities & Media === */}
//               {currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium text-gray-900">Package Activities</h3>
//                     <div className="space-y-2">
//                       <Label className="text-sm font-medium text-gray-700">
//                         Select Activities
//                       </Label>
//                       <MultiSelect
//                         options={activityOptions}
//                         value={data.activities.map((id) => id.toString())}
//                         onValueChange={handleActivityChange}
//                         placeholder="Select activities for this package"
//                         variant="inverted"
//                         maxCount={3}
//                       />
//                       <p className="text-sm text-gray-500">
//                         Choose activities that are included in this package.
//                       </p>
//                       {errors.activities && (
//                         <p className="text-sm text-red-600">{errors.activities}</p>
//                       )}
//                     </div>

//                     {data.activities.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="text-sm font-medium text-gray-700 mb-2">
//                           Selected Activities:
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {data.activities.map((activityId, index) => {
//                             const a = allActivities.find((act) => act.id === activityId);
//                             return (
//                               <div
//                                 key={index}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                               >
//                                 {a ? `${a.title} - $${a.price}` : `Activity #${activityId}`}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     const newArr = data.activities.filter((id) => id !== activityId);
//                                     setData('activities', newArr);
//                                   }}
//                                   className="ml-2 text-blue-600 hover:text-blue-800"
//                                 >
//                                   <X className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <Separator className="my-6" />

//                   <div className="space-y-6">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Package Media (5–6 images total, ≤1 MB each)
//                     </h3>

//                     {/* 2a) Existing images → remove with a bigger X */}
//                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                       {existingMedia.map((m, idx) => (
//                         <div
//                           key={m.id}
//                           className={`relative group rounded-lg border ${
//                             /* red outline if already marked for deletion */ ''
//                           } overflow-visible`}
//                         >
//                           <img
//                             src={m.url}
//                             alt={`Existing ${idx + 1}`}
//                             className="w-full h-24 object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeExistingImage(idx)}
//                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
//                     <p className="text-sm text-gray-500">
//                       Remove any existing image by clicking its “X.” You must end up with 5–6 images total.
//                     </p>

//                     {/* 2b) Upload new images */}
//                     <div className={errors.images ? 'border border-red-500 p-2 rounded-md' : ''}>
//                       <div className="flex items-center gap-4">
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
//                           multiple
//                           onChange={handleImageUpload}
//                           className="hidden"
//                           id="new-image-upload"
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             document.getElementById('new-image-upload')?.click();
//                           }}
//                           disabled={existingMedia.length + data.images.length >= 6 || processing}
//                           className="flex items-center gap-2"
//                         >
//                           <Upload className="w-4 h-4" /> Upload New Images
//                         </Button>
//                         <p className="text-sm text-gray-500">
//                           {existingMedia.length + data.images.length}/6
//                         </p>
//                       </div>
//                       {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
//                     </div>

//                     {/* Previews for newly added files */}
//                     {imagePreview.length > 0 && (
//                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//                         {imagePreview.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <img
//                               src={preview}
//                               alt={`Preview ${index + 1}`}
//                               className="w-full h-24 object-cover rounded-lg border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeNewImage(index)}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* === Step 3: Flight & Hotel Details === */}
//               {currentStep === 3 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Flight & Hotel Information
//                   </h3>
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Flight Details (Optional)</h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="flight_from" className="text-sm font-medium text-gray-700">
//                           Flight From
//                         </Label>
//                         <Input
//                           id="flight_from"
//                           placeholder="e.g., New York (JFK)"
//                           value={data.flight_from}
//                           onChange={(e) => setData('flight_from', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.flight_from && (
//                           <p className="text-sm text-red-600">{errors.flight_from}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="flight_to" className="text-sm font-medium text-gray-700">
//                           Flight To
//                         </Label>
//                         <Input
//                           id="flight_to"
//                           placeholder="e.g., Paris (CDG)"
//                           value={data.flight_to}
//                           onChange={(e) => setData('flight_to', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.flight_to && (
//                           <p className="text-sm text-red-600">{errors.flight_to}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="airline_name" className="text-sm font-medium text-gray-700">
//                           Airline Name
//                         </Label>
//                         <Input
//                           id="airline_name"
//                           placeholder="e.g., Air France"
//                           value={data.airline_name}
//                           onChange={(e) => setData('airline_name', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.airline_name && (
//                           <p className="text-sm text-red-600">{errors.airline_name}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="booking_class" className="text-sm font-medium text-gray-700">
//                           Booking Class
//                         </Label>
//                         <Select
//                           value={data.booking_class}
//                           onValueChange={(value) => setData('booking_class', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select class" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="economy">Economy</SelectItem>
//                             <SelectItem value="premium_economy">Premium Economy</SelectItem>
//                             <SelectItem value="business">Business</SelectItem>
//                             <SelectItem value="first">First Class</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.booking_class && (
//                           <p className="text-sm text-red-600">{errors.booking_class}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Hotel Details (Optional)</h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="hotel_name" className="text-sm font-medium text-gray-700">
//                           Hotel Name
//                         </Label>
//                         <Input
//                           id="hotel_name"
//                           placeholder="e.g., Le Meurice"
//                           value={data.hotel_name}
//                           onChange={(e) => setData('hotel_name', e.target.value)}
//                           className="w-full"
//                         />
//                         {errors.hotel_name && (
//                           <p className="text-sm text-red-600">{errors.hotel_name}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="hotel_star_rating" className="text-sm font-medium text-gray-700">
//                           Star Rating
//                         </Label>
//                         <Select
//                           value={data.hotel_star_rating}
//                           onValueChange={(value) => setData('hotel_star_rating', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select rating" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="1">1 Star</SelectItem>
//                             <SelectItem value="2">2 Stars</SelectItem>
//                             <SelectItem value="3">3 Stars</SelectItem>
//                             <SelectItem value="4">4 Stars</SelectItem>
//                             <SelectItem value="5">5 Stars</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.hotel_star_rating && (
//                           <p className="text-sm text-red-600">{errors.hotel_star_rating}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="hotel_checkin" className="text-sm font-medium text-gray-700">
//                           Hotel Check-in Date
//                         </Label>
//                         <div className="relative">
//                           <Input
//                             id="hotel_checkin"
//                             type="date"
//                             value={data.hotel_checkin}
//                             onChange={(e) => setData('hotel_checkin', e.target.value)}
//                             className="w-full pr-10"
//                           />
//                           <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         </div>
//                         {errors.hotel_checkin && (
//                           <p className="text-sm text-red-600">{errors.hotel_checkin}</p>
//                         )}
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="hotel_checkout" className="text-sm font-medium text-gray-700">
//                           Hotel Check-out Date
//                         </Label>
//                         <div className="relative">
//                           <Input
//                             id="hotel_checkout"
//                             type="date"
//                             value={data.hotel_checkout}
//                             onChange={(e) => setData('hotel_checkout', e.target.value)}
//                             className="w-full pr-10"
//                           />
//                           <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         </div>
//                         {errors.hotel_checkout && (
//                           <p className="text-sm text-red-600">{errors.hotel_checkout}</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* === Step 4: Settings & Policies === */}
//               {currentStep === 4 && (
//                 <div className="space-y-6">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Settings & Policies</h3>
//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Package Settings</h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium text-gray-700">Visibility</Label>
//                         <Select
//                           value={data.visibility}
//                           onValueChange={(value) => setData('visibility', value)}
//                         >
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select visibility" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="public">Public - Visible to everyone</SelectItem>
//                             <SelectItem value="private">Private - Only visible to you</SelectItem>
//                             <SelectItem value="agents_only">Agents Only - Visible to agents</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         {errors.visibility && (
//                           <p className="text-sm text-red-600">{errors.visibility}</p>
//                         )}
//                       </div>

//                       <div className="space-y-4">
//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_active"
//                             checked={data.is_active}
//                             onCheckedChange={(checked) => setData('is_active', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
//                             Active Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">Package is available for booking</p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_featured"
//                             checked={data.is_featured}
//                             onCheckedChange={(checked) => setData('is_featured', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
//                             Featured Package
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">Display in featured section</p>

//                         <div className="flex items-center space-x-2">
//                           <Checkbox
//                             id="is_refundable"
//                             checked={data.is_refundable}
//                             onCheckedChange={(checked) => setData('is_refundable', !!checked)}
//                             disabled={processing}
//                           />
//                           <Label htmlFor="is_refundable" className="text-sm font-medium text-gray-700">
//                             Refundable
//                           </Label>
//                         </div>
//                         <p className="text-xs text-gray-500 ml-6">Allow refunds for this package</p>
//                       </div>
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Terms & Conditions</h4>
//                     <div className="space-y-2">
//                       <Label htmlFor="terms_and_conditions" className="text-sm font-medium text-gray-700">
//                         Terms and Conditions
//                       </Label>
//                       <Textarea
//                         id="terms_and_conditions"
//                         placeholder="Enter terms and conditions for this package…"
//                         value={data.terms_and_conditions}
//                         onChange={(e) => setData('terms_and_conditions', e.target.value)}
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Include any important terms, conditions, and requirements for this package.
//                       </p>
//                       {errors.terms_and_conditions && (
//                         <p className="text-sm text-red-600">{errors.terms_and_conditions}</p>
//                       )}
//                     </div>
//                   </div>

//                   <Separator />

//                   <div className="space-y-4">
//                     <h4 className="text-md font-medium text-gray-700">Cancellation Policy</h4>
//                     <div className="space-y-2">
//                       <Label htmlFor="cancellation_policy" className="text-sm font-medium text-gray-700">
//                         Cancellation Policy
//                       </Label>
//                       <Textarea
//                         id="cancellation_policy"
//                         placeholder="Enter cancellation policy for this package…"
//                         value={data.cancellation_policy}
//                         onChange={(e) => setData('cancellation_policy', e.target.value)}
//                         className="w-full min-h-[120px] resize-y"
//                         disabled={processing}
//                       />
//                       <p className="text-xs text-gray-500">
//                         Define deadlines, refund timelines, and any non-refundable fees.
//                       </p>
//                       {errors.cancellation_policy && (
//                         <p className="text-sm text-red-600">{errors.cancellation_policy}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-start space-x-3">
//                       <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
//                       <div>
//                         <h5 className="text-sm font-medium text-blue-900 mb-1">Policy Guidelines</h5>
//                         <p className="text-sm text-blue-700">
//                           Ensure your terms and cancellation policies are clear and comply with local regulations.
//                           Include details about booking changes, refund timelines, and any non-refundable fees.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* === Navigation Buttons === */}
//               <div className="flex items-center justify-between pt-6 border-t border-gray-200">
//                 <div className="flex items-center space-x-2">
//                   {currentStep > 1 && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={prevStep}
//                       className="flex items-center space-x-2"
//                       disabled={processing}
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       <span>Previous</span>
//                     </Button>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   {currentStep < 4 ? (
//                     <div
//                       onClick={nextStep}
//                       role="button"
//                       tabIndex={0}
//                       className={`inline-flex items-center space-x-2 px-4 py-2 rounded text-white ${
//                         processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
//                       }`}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           e.preventDefault();
//                           nextStep();
//                         }
//                       }}
//                     >
//                       {processing && (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       )}
//                       <span>Next</span>
//                       <ChevronRight className="w-4 h-4" />
//                     </div>
//                   ) : (
//                     <Button
//                       type="submit"
//                       disabled={processing}
//                       className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
//                     >
//                       {processing ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                           <span>Updating…</span>
//                         </>
//                       ) : (
//                         <>
//                           <Plus className="w-4 h-4" />
//                           <span>Update Package</span>
//                         </>
//                       )}
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// }



// src/Pages/packages/EditPackage.tsx

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
  Calendar,
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
  // 1. Keep existing images in state
  const [existingMedia, setExistingMedia] = useState(incomingImages);

  // 2. Previews for newly added files
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // 3. Inertia form, spoofing PUT and handling all fields
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
    images: [],                // new File objects
    deleted_image_ids: [],     // IDs of media to delete
  });
  const { data, setData, processing, errors, progress } = form;

  // 4. Flash success → toast + redirect
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
      router.visit(route('packages.index'));
    }
  }, [flash.success]);

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

  // Simple step validation
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
      case 2: {
        const existingCount = existingMedia.length;
        const newCount = Array.isArray(data.images)
          ? data.images.length
          : data.images instanceof FileList
          ? data.images.length
          : 0;
        const total = existingCount + newCount;
        return total >= 4 && total <= 5;
      }
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
      toast.error(
        currentStep === 2
          ? 'You must have 4-5 images total.'
          : 'Please complete all required fields.'
      );
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  // Handle new file uploads
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setData('images', files);
    const arr = Array.from(files);
    setImagePreview(arr.map((f) => URL.createObjectURL(f)));
  }

  // Remove one of the newly added files
  function removeNewImage(index: number) {
    const arr = Array.from(data.images as FileList);
    const updated = arr.filter((_, i) => i !== index);
    const previews = imagePreview.filter((_, i) => i !== index);
    setData('images', updated);
    setImagePreview(previews);
  }

  // Mark an existing image for deletion
  function removeExistingImage(mediaId: number) {
    setExistingMedia((m) => m.filter((x) => x.id !== mediaId));
    setData('deleted_image_ids', [...data.deleted_image_ids, mediaId]);
  }

  // Handle activities multi‐select
  function handleActivityChange(values: string[]) {
    setData(
      'activities',
      values.map((v) => parseInt(v, 10))
    );
  }

  // Final submit
  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('packages.update', pkg.id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Package updated successfully!'),
      onError: (errs) => {
        const fields = Object.keys(errs);
        const step = Math.min(
          ...fields.map((f) => stepFieldMap[f] || 1)
        );
        setCurrentStep(step);
        toast.error('Validation errors—please review the form.');
      },
    });
  }

  // Cleanup blob URLs
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
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-medium mb-4">Edit Package</CardTitle>
            {/* Step indicators */}
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
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                        currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Upload progress */}
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
                  {/* Title & Description */}
                  <h3 className="text-lg font-medium mb-4">Basic Package Information</h3>
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
                      {errors.title && <p className="text-red-600">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., 5-day luxury package…"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        required
                      />
                      {errors.description && (
                        <p className="text-red-600">{errors.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Price & Location */}
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
                      {errors.location && <p className="text-red-600">{errors.location}</p>}
                    </div>
                  </div>

                  {/* Agent Addon */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agent_addon_price">Agent Addon Price *</Label>
                      <Input
                        id="agent_addon_price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.agent_addon_price}
                        onChange={(e) => setData('agent_addon_price', e.target.value)}
                        required
                      />
                      {errors.agent_addon_price && (
                        <p className="text-red-600">{errors.agent_addon_price}</p>
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
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.agent_price_type && (
                        <p className="text-red-600">{errors.agent_price_type}</p>
                      )}
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="booking_start_date">Booking Start Date</Label>
                      <div className="relative">
                        <Input
                          id="booking_start_date"
                          type="date"
                          value={data.booking_start_date}
                          onChange={(e) =>
                            setData('booking_start_date', e.target.value)
                          }
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.booking_start_date && (
                        <p className="text-red-600">{errors.booking_start_date}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="booking_end_date">Booking End Date</Label>
                      <div className="relative">
                        <Input
                          id="booking_end_date"
                          type="date"
                          value={data.booking_end_date}
                          onChange={(e) =>
                            setData('booking_end_date', e.target.value)
                          }
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.booking_end_date && (
                        <p className="text-red-600">{errors.booking_end_date}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 2: Activities & Media === */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Activities */}
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

                  {/* Existing Media */}
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

                    {/* Upload New */}
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

                    {/* Previews */}
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
                  {/* Flight */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Flight Details (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="flight_from">Flight From</Label>
                        <Input
                          id="flight_from"
                          placeholder="e.g., JFK"
                          value={data.flight_from}
                          onChange={(e) =>
                            setData('flight_from', e.target.value)
                          }
                        />
                        {errors.flight_from && (
                          <p className="text-red-600">{errors.flight_from}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="flight_to">Flight To</Label>
                        <Input
                          id="flight_to"
                          placeholder="e.g., CDG"
                          value={data.flight_to}
                          onChange={(e) =>
                            setData('flight_to', e.target.value)
                          }
                        />
                        {errors.flight_to && (
                          <p className="text-red-600">{errors.flight_to}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="airline_name">Airline Name</Label>
                        <Input
                          id="airline_name"
                          placeholder="e.g., Air France"
                          value={data.airline_name}
                          onChange={(e) =>
                            setData('airline_name', e.target.value)
                          }
                        />
                        {errors.airline_name && (
                          <p className="text-red-600">{errors.airline_name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Booking Class</Label>
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

                  {/* Hotel */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Hotel Details (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hotel_name">Hotel Name</Label>
                        <Input
                          id="hotel_name"
                          placeholder="e.g., Le Meurice"
                          value={data.hotel_name}
                          onChange={(e) =>
                            setData('hotel_name', e.target.value)
                          }
                        />
                        {errors.hotel_name && (
                          <p className="text-red-600">{errors.hotel_name}</p>
                        )}
                      </div>
                      <div>
                        <Label>Star Rating</Label>
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
                        <Label htmlFor="hotel_checkin">Check-in Date</Label>
                        <div className="relative">
                          <Input
                            id="hotel_checkin"
                            type="date"
                            value={data.hotel_checkin}
                            onChange={(e) =>
                              setData('hotel_checkin', e.target.value)
                            }
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.hotel_checkin && (
                          <p className="text-red-600">{errors.hotel_checkin}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="hotel_checkout">Check-out Date</Label>
                        <div className="relative">
                          <Input
                            id="hotel_checkout"
                            type="date"
                            value={data.hotel_checkout}
                            onChange={(e) =>
                              setData('hotel_checkout', e.target.value)
                            }
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        {errors.hotel_checkout && (
                          <p className="text-red-600">{errors.hotel_checkout}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 4: Settings & Policies === */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Settings & Policies</h3>

                  {/* Visibility & Toggles */}
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

                  {/* Terms & Conditions */}
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

                  {/* Cancellation Policy */}
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

                  {/* Policy Note */}
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={processing}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={processing}
                      className="flex items-center space-x-2"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={processing} className="bg-green-600">
                      {processing ? 'Updating…' : <><Plus className="w-4 h-4" /> Update Package</>}
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
