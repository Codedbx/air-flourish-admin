// import { type BreadcrumbItem, type SharedData } from '@/types';
// import { Transition } from '@headlessui/react';
// import { Head, Link, useForm, usePage } from '@inertiajs/react';
// import { FormEventHandler } from 'react';

// import DeleteUser from '@/components/delete-user';
// import HeadingSmall from '@/components/heading-small';
// import InputError from '@/components/input-error';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Profile settings',
//         href: '/settings/profile',
//     },
// ];

// type ProfileForm = {
//     name: string;
//     email: string;
// }

// export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
//     const { auth } = usePage<SharedData>().props;

//     const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
//         name: auth.user.name,
//         email: auth.user.email,
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();

//         patch(route('profile.update'), {
//             preserveScroll: true,
//         });
//     };

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Profile settings" />

//             <SettingsLayout>
//                 <div className="space-y-6">
//                     <HeadingSmall title="Profile information" description="Update your name and email address" />

//                     <form onSubmit={submit} className="space-y-6">
//                         <div className="grid gap-2">
//                             <Label htmlFor="name">Name</Label>

//                             <Input
//                                 id="name"
//                                 className="mt-1 block w-full"
//                                 value={data.name}
//                                 onChange={(e) => setData('name', e.target.value)}
//                                 required
//                                 autoComplete="name"
//                                 placeholder="Full name"
//                             />

//                             <InputError className="mt-2" message={errors.name} />
//                         </div>

//                         <div className="grid gap-2">
//                             <Label htmlFor="email">Email address</Label>

//                             <Input
//                                 id="email"
//                                 type="email"
//                                 className="mt-1 block w-full"
//                                 value={data.email}
//                                 onChange={(e) => setData('email', e.target.value)}
//                                 required
//                                 autoComplete="username"
//                                 placeholder="Email address"
//                             />

//                             <InputError className="mt-2" message={errors.email} />
//                         </div>

//                         {mustVerifyEmail && auth.user.email_verified_at === null && (
//                             <div>
//                                 <p className="text-muted-foreground -mt-4 text-sm">
//                                     Your email address is unverified.{' '}
//                                     <Link
//                                         href={route('verification.send')}
//                                         method="post"
//                                         as="button"
//                                         className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
//                                     >
//                                         Click here to resend the verification email.
//                                     </Link>
//                                 </p>

//                                 {status === 'verification-link-sent' && (
//                                     <div className="mt-2 text-sm font-medium text-green-600">
//                                         A new verification link has been sent to your email address.
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         <div className="flex items-center gap-4">
//                             <Button disabled={processing}>Save</Button>

//                             <Transition
//                                 show={recentlySuccessful}
//                                 enter="transition ease-in-out"
//                                 enterFrom="opacity-0"
//                                 leave="transition ease-in-out"
//                                 leaveTo="opacity-0"
//                             >
//                                 <p className="text-sm text-neutral-600">Saved</p>
//                             </Transition>
//                         </div>
//                     </form>
//                 </div>

//                 <DeleteUser />
//             </SettingsLayout>
//         </AppLayout>
//     );
// }




import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
    business_name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    cac_reg_no: string;
}

export default function Profile({ 
    mustVerifyEmail, 
    status 
}: { 
    mustVerifyEmail: boolean; 
    status?: string 
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        name: auth.user.name,
        email: auth.user.email,
        business_name: auth.user.business_name,
        phone: auth.user.phone,
        address: auth.user.address,
        city: auth.user.city,
        state: auth.user.state,
        country: auth.user.country,
        zip_code: auth.user.zip_code,
        cac_reg_no: auth.user.cac_reg_no,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title="Profile information" 
                        description="Update your personal and business information" 
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Enter your full name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="email"
                                            placeholder="Enter your email address"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            autoComplete="tel"
                                            placeholder="Enter your phone number"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="text-yellow-900 underline hover:no-underline font-medium"
                                            >
                                                Click here to resend the verification email.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Business Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Business Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">Business Name</Label>
                                        <Input
                                            id="business_name"
                                            value={data.business_name}
                                            onChange={(e) => setData('business_name', e.target.value)}
                                            placeholder="Enter your business name"
                                        />
                                        <InputError message={errors.business_name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cac_reg_no">CAC Registration Number</Label>
                                        <Input
                                            id="cac_reg_no"
                                            value={data.cac_reg_no}
                                            onChange={(e) => setData('cac_reg_no', e.target.value)}
                                            placeholder="Enter CAC registration number"
                                        />
                                        <InputError message={errors.cac_reg_no} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Business Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Enter your business address"
                                            rows={3}
                                        />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="Enter your city"
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            placeholder="Enter your state"
                                        />
                                        <InputError message={errors.state} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            placeholder="Enter your country"
                                        />
                                        <InputError message={errors.country} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zip_code">ZIP/Postal Code</Label>
                                        <Input
                                            id="zip_code"
                                            value={data.zip_code}
                                            onChange={(e) => setData('zip_code', e.target.value)}
                                            placeholder="Enter ZIP/postal code"
                                        />
                                        <InputError message={errors.zip_code} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="px-6"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600 font-medium">Profile updated successfully!</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <div className="mt-8">
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}