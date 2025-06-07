import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InvoiceTable from '@/components/dashboard/InvoiceTable'
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/inoices',
    },
];

export default function Invoices() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <InvoiceTable />
            </div>
        </AppLayout>
    );
}
