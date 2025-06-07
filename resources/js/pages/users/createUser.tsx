// import AppLayout from '@/layouts/app-layout';
// import { Head, useForm, usePage } from '@inertiajs/react';
// import { useState } from 'react';
// import {
//   ArrowLeft,
//   Building,
//   Users,
//   Shield,
//   Crown,
//   Eye,
//   Phone,
//   MapPin,
//   Globe,
//   Home,
//   Key,
//   CreditCard,
//   Mail,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';

// import type { BreadcrumbItem } from '@/types';

// type Role = {
//   id: number;
//   name: string;
//   guard_name: string;
// };

// type PageProps = {
//   roles: Role[];
//   [key: string]: unknown;
// };

// const breadcrumbs: BreadcrumbItem[] = [
//   {
//     title: 'Create User',
//     href: route('users.create'),
//   },
// ];

// export default function CreateUser() {
//   const { roles } = usePage<PageProps>().props;

//   // Inertia form state
//   const { data, setData, post, processing, errors, reset } = useForm({
//     first_name: '',
//     last_name: '',
//     business_name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     zip_code: '',
//     cac_reg_no: '',
//     roles: [] as string[], // array of role names
//     active: true,
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const toggleRole = (roleName: string) => {
//     if (data.roles.includes(roleName)) {
//       setData('roles', data.roles.filter((r) => r !== roleName));
//     } else {
//       setData('roles', [...data.roles, roleName]);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     post(route('users.store'), {
//       preserveScroll: true,
//       onSuccess: () => reset(),
//     });
//   };

//   const getRoleIcon = (roleName: string) => {
//     switch (roleName) {
//       case 'admin':
//         return Crown;
//       case 'manager':
//         return Shield;
//       case 'user':
//         return Users;
//       default:
//         return Users;
//     }
//   };

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Create User" />

//       <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//         <div className="p-4 sm:p-6  space-y-6">
//           {/* Header */}
//           <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//             <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => window.history.back()}
//                 className="flex items-center space-x-2 w-fit"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 <span>Back to Users</span>
//               </Button>
//               <div>
//                 <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
//                   Create New User
//                 </h1>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Fill out all fields to add a new user
//                 </p>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal / Name */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Users className="w-5 h-5" />
//                   <span>Personal Information</span>
//                 </CardTitle>
//                 <CardDescription>
//                   First and last name
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* First Name */}
//                   <div className="space-y-2">
//                     <Label htmlFor="first_name">
//                       First Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="first_name"
//                       value={data.first_name}
//                       onChange={(e) => setData('first_name', e.target.value)}
//                       placeholder="Enter first name"
//                       className={errors.first_name ? 'border-red-500' : ''}
//                     />
//                     {errors.first_name && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.first_name}
//                       </p>
//                     )}
//                   </div>

//                   {/* Last Name */}
//                   <div className="space-y-2">
//                     <Label htmlFor="last_name">
//                       Last Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="last_name"
//                       value={data.last_name}
//                       onChange={(e) => setData('last_name', e.target.value)}
//                       placeholder="Enter last name"
//                       className={errors.last_name ? 'border-red-500' : ''}
//                     />
//                     {errors.last_name && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.last_name}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Business & Contact */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Building className="w-5 h-5" />
//                   <span>Business & Contact</span>
//                 </CardTitle>
//                 <CardDescription>
//                   Business name, email, phone, CAC, etc.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Business Name */}
//                   <div className="space-y-2">
//                     <Label htmlFor="business_name">Business Name</Label>
//                     <div className="relative">
//                       <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="business_name"
//                         value={data.business_name}
//                         onChange={(e) =>
//                           setData('business_name', e.target.value)
//                         }
//                         placeholder="Enter business name"
//                         className="pl-10"
//                       />
//                     </div>
//                     {errors.business_name && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.business_name}
//                       </p>
//                     )}
//                   </div>

//                   {/* Email */}
//                   <div className="space-y-2">
//                     <Label htmlFor="email">
//                       Email <span className="text-red-500">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="email"
//                         type="email"
//                         value={data.email}
//                         onChange={(e) => setData('email', e.target.value)}
//                         placeholder="Enter email address"
//                         className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
//                       />
//                     </div>
//                     {errors.email && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.email}
//                       </p>
//                     )}
//                   </div>

//                   {/* Phone */}
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="phone"
//                         value={data.phone}
//                         onChange={(e) => setData('phone', e.target.value)}
//                         placeholder="Enter phone number"
//                         className={errors.phone ? 'border-red-500' : ''}
//                       />
//                     </div>
//                     {errors.phone && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.phone}
//                       </p>
//                     )}
//                   </div>

//                   {/* CAC Reg. No */}
//                   <div className="space-y-2">
//                     <Label htmlFor="cac_reg_no">CAC Reg. No</Label>
//                     <div className="relative">
//                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="cac_reg_no"
//                         value={data.cac_reg_no}
//                         onChange={(e) =>
//                           setData('cac_reg_no', e.target.value)
//                         }
//                         placeholder="Enter CAC registration"
//                         className={errors.cac_reg_no ? 'border-red-500' : ''}
//                       />
//                     </div>
//                     {errors.cac_reg_no && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.cac_reg_no}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Address Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <MapPin className="w-5 h-5" />
//                   <span>Address Details</span>
//                 </CardTitle>
//                 <CardDescription>
//                   Street address, city, state, country, zip code
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Street Address */}
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Textarea
//                     id="address"
//                     value={data.address}
//                     onChange={(e) => setData('address', e.target.value)}
//                     placeholder="Enter street address"
//                     rows={2}
//                     className={errors.address ? 'border-red-500' : ''}
//                   />
//                   {errors.address && (
//                     <p className="text-sm text-red-600 mt-1">
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* City */}
//                   <div className="space-y-2">
//                     <Label htmlFor="city">City</Label>
//                     <Input
//                       id="city"
//                       value={data.city}
//                       onChange={(e) => setData('city', e.target.value)}
//                       placeholder="Enter city"
//                       className={errors.city ? 'border-red-500' : ''}
//                     />
//                     {errors.city && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.city}
//                       </p>
//                     )}
//                   </div>

//                   {/* State */}
//                   <div className="space-y-2">
//                     <Label htmlFor="state">State</Label>
//                     <Input
//                       id="state"
//                       value={data.state}
//                       onChange={(e) => setData('state', e.target.value)}
//                       placeholder="Enter state"
//                       className={errors.state ? 'border-red-500' : ''}
//                     />
//                     {errors.state && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.state}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Country */}
//                   <div className="space-y-2">
//                     <Label htmlFor="country">Country</Label>
//                     <div className="relative">
//                       <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="country"
//                         value={data.country}
//                         onChange={(e) => setData('country', e.target.value)}
//                         placeholder="Enter country"
//                         className={`pl-10 ${
//                           errors.country ? 'border-red-500' : ''
//                         }`}
//                       />
//                     </div>
//                     {errors.country && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.country}
//                       </p>
//                     )}
//                   </div>

//                   {/* Zip Code */}
//                   <div className="space-y-2">
//                     <Label htmlFor="zip_code">Zip Code</Label>
//                     <div className="relative">
//                       <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <Input
//                         id="zip_code"
//                         value={data.zip_code}
//                         onChange={(e) => setData('zip_code', e.target.value)}
//                         placeholder="Enter zip code"
//                         className={`pl-10 ${
//                           errors.zip_code ? 'border-red-500' : ''
//                         }`}
//                       />
//                     </div>
//                     {errors.zip_code && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.zip_code}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Security / Password */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Key className="w-5 h-5" />
//                   <span>Security Information</span>
//                 </CardTitle>
//                 <CardDescription>Set login credentials</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Password */}
//                   <div className="space-y-2">
//                     <Label htmlFor="password">
//                       Password <span className="text-red-500">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Input
//                         id="password"
//                         type={showPassword ? 'text' : 'password'}
//                         value={data.password}
//                         onChange={(e) => setData('password', e.target.value)}
//                         placeholder="Enter password"
//                         className={`pr-10 ${
//                           errors.password ? 'border-red-500' : ''
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showPassword ? (
//                           <Eye className="w-4 h-4" />
//                         ) : (
//                           <Eye className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                     {errors.password && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.password}
//                       </p>
//                     )}
//                   </div>

//                   {/* Confirm Password */}
//                   <div className="space-y-2">
//                     <Label htmlFor="password_confirmation">
//                       Confirm Password <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       id="password_confirmation"
//                       type={showPassword ? 'text' : 'password'}
//                       value={data.password_confirmation}
//                       onChange={(e) =>
//                         setData('password_confirmation', e.target.value)
//                       }
//                       placeholder="Confirm password"
//                       className={
//                         errors.password_confirmation ? 'border-red-500' : ''
//                       }
//                     />
//                     {errors.password_confirmation && (
//                       <p className="text-sm text-red-600 mt-1">
//                         {errors.password_confirmation}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Assign Roles */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Shield className="w-5 h-5" />
//                   <span>Assign Roles</span>
//                 </CardTitle>
//                 <CardDescription>
//                   Click badges to toggle roles
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-wrap gap-2">
//                   {roles.map((role) => {
//                     const isSelected = data.roles.includes(role.name);
//                     const Icon = getRoleIcon(role.name);
//                     return (
//                       <Badge
//                         key={role.name}
//                         variant={isSelected ? 'default' : 'outline'}
//                         className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
//                           isSelected
//                             ? 'bg-primary text-primary-foreground shadow-md'
//                             : 'hover:bg-muted border-2 border-dashed'
//                         }`}
//                         onClick={() => toggleRole(role.name)}
//                       >
//                         <div className="flex items-center gap-1.5">
//                           <Icon className="w-3 h-3" />
//                           <span>
//                             {role.name.charAt(0).toUpperCase() +
//                               role.name.slice(1)}
//                           </span>
//                         </div>
//                       </Badge>
//                     );
//                   })}
//                 </div>
//                 {errors.roles && (
//                   <p className="text-sm text-red-600 mt-1">
//                     {errors.roles}
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Active Toggle */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Account Status</CardTitle>
//                 <CardDescription>
//                   Enable or disable user login
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <Label>Active User</Label>
//                     <p className="text-sm text-gray-500">
//                       Toggle to deactivate/reactivate account
//                     </p>
//                   </div>
//                   <Switch
//                     checked={data.active}
//                     onCheckedChange={(checked) => setData('active', checked)}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Action Buttons */}
//             <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => window.history.back()}
//                 disabled={processing}
//                 className="w-full sm:w-auto"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={processing}
//                 className="w-full sm:w-auto"
//               >
//                 {processing ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                     Creating…
//                   </>
//                 ) : (
//                   <>Create User</>
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }



import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
  ArrowLeft,
  Building,
  Users,
  Shield,
  Crown,
  Eye,
  Phone,
  MapPin,
  Globe,
  Home,
  Key,
  CreditCard,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import type { BreadcrumbItem } from '@/types';

type Role = {
  id: number;
  name: string;
  guard_name: string;
};

type PageProps = {
  roles: Role[];
  [key: string]: unknown;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create User',
    href: route('users.create'),
  },
];

export default function CreateUser() {
  const { roles } = usePage<PageProps>().props;

  // Inertia form state, now including three file fields (initially null)
  const { data, setData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    business_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    cac_reg_no: '',
    roles: [] as string[],
    active: true,

    // New file fields:
    profile_image: null as File | null,
    registration_certificate: null as File | null,
    license_image: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleRole = (roleName: string) => {
    if (data.roles.includes(roleName)) {
      setData('roles', data.roles.filter((r) => r !== roleName));
    } else {
      setData('roles', [...data.roles, roleName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return Crown;
      case 'manager':
        return Shield;
      case 'user':
        return Users;
      default:
        return Users;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create User" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Users</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Create New User
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out all fields to add a new user
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Personal / Name */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  First and last name
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      value={data.first_name}
                      onChange={(e) => setData('first_name', e.target.value)}
                      placeholder="Enter first name"
                      className={errors.first_name ? 'border-red-500' : ''}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      value={data.last_name}
                      onChange={(e) => setData('last_name', e.target.value)}
                      placeholder="Enter last name"
                      className={errors.last_name ? 'border-red-500' : ''}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business & Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Business & Contact</span>
                </CardTitle>
                <CardDescription>
                  Business name, email, phone, CAC, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="business_name"
                        value={data.business_name}
                        onChange={(e) =>
                          setData('business_name', e.target.value)
                        }
                        placeholder="Enter business name"
                        className="pl-10"
                      />
                    </div>
                    {errors.business_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.business_name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter email address"
                        className={`pl-10 ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Enter phone number"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* CAC Reg. No */}
                  <div className="space-y-2">
                    <Label htmlFor="cac_reg_no">CAC Reg. No</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="cac_reg_no"
                        value={data.cac_reg_no}
                        onChange={(e) =>
                          setData('cac_reg_no', e.target.value)
                        }
                        placeholder="Enter CAC registration"
                        className={errors.cac_reg_no ? 'border-red-500' : ''}
                      />
                    </div>
                    {errors.cac_reg_no && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.cac_reg_no}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Address Details</span>
                </CardTitle>
                <CardDescription>
                  Street address, city, state, country, zip code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Street Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Enter street address"
                    rows={2}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      placeholder="Enter city"
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={data.state}
                      onChange={(e) => setData('state', e.target.value)}
                      placeholder="Enter state"
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="country"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                        placeholder="Enter country"
                        className={`pl-10 ${
                          errors.country ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.country && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="zip_code"
                        value={data.zip_code}
                        onChange={(e) => setData('zip_code', e.target.value)}
                        placeholder="Enter zip code"
                        className={`pl-10 ${
                          errors.zip_code ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.zip_code && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.zip_code}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security / Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Security Information</span>
                </CardTitle>
                <CardDescription>Set login credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter password"
                        className={`pr-10 ${
                          errors.password ? 'border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password_confirmation"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                      }
                      placeholder="Confirm password"
                      className={
                        errors.password_confirmation ? 'border-red-500' : ''
                      }
                    />
                    {errors.password_confirmation && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assign Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Assign Roles</span>
                </CardTitle>
                <CardDescription>
                  Click badges to toggle roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => {
                    const isSelected = data.roles.includes(role.name);
                    const Icon = getRoleIcon(role.name);
                    return (
                      <Badge
                        key={role.name}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'hover:bg-muted border-2 border-dashed'
                        }`}
                        onClick={() => toggleRole(role.name)}
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3" />
                          <span>
                            {role.name.charAt(0).toUpperCase() +
                              role.name.slice(1)}
                          </span>
                        </div>
                      </Badge>
                    );
                  })}
                </div>
                {errors.roles && (
                  <p className="text-sm text-red-600 mt-1">{errors.roles}</p>
                )}
              </CardContent>
            </Card>

            {/* Uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Uploads</span>
                </CardTitle>
                <CardDescription>
                  Profile image, registration certificate, license image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Image */}
                <div className="space-y-2">
                  <Label htmlFor="profile_image">Profile Image</Label>
                  <Input
                    id="profile_image"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData('profile_image', e.target.files?.[0] || null)
                    }
                  />
                  {errors.profile_image && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.profile_image}
                    </p>
                  )}
                </div>

                {/* Registration Certificate */}
                <div className="space-y-2">
                  <Label htmlFor="registration_certificate">
                    Registration Certificate
                  </Label>
                  <Input
                    id="registration_certificate"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData(
                        'registration_certificate',
                        e.target.files?.[0] || null
                      )
                    }
                  />
                  {errors.registration_certificate && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.registration_certificate}
                    </p>
                  )}
                </div>

                {/* License Image */}
                <div className="space-y-2">
                  <Label htmlFor="license_image">License Image</Label>
                  <Input
                    id="license_image"
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setData('license_image', e.target.files?.[0] || null)
                    }
                  />
                  {errors.license_image && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.license_image}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Enable or disable user login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Active User</Label>
                    <p className="text-sm text-gray-500">
                      Toggle to deactivate/reactivate account
                    </p>
                  </div>
                  <Switch
                    checked={data.active}
                    onCheckedChange={(checked) => setData('active', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={processing}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="w-full sm:w-auto"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating…
                  </>
                ) : (
                  <>Create User</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
