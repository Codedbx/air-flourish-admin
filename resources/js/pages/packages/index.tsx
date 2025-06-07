import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import PackagesTable from "@/components/dashboard/PackagesTable"
import { PackageResponse } from '@/types/package';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Packages',
        href: '/packages/all',
    },
];

export default function AllPackages() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Packages" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>

                    <PackagesTable />
                </div>
            </div>
        </AppLayout>
    );
}
