import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DashboardStatsCards from '@/components/dashboard/DashboardStatCards'
import { GraphComponent } from '@/components/dashboard/GraphComponent'
import { PieChart } from '@/components/dashboard/PieChart'
import TableComponent from '@/components/dashboard/TableComponent'
import NotificationsPanel from "@/components/dashboard/NotificationsPanel"
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { props } = usePage();
    const {
        metrics,
        weeklyPayments,
        yMaxWeekly,
        monthlyPayments,
        yMaxMonthly,
        yearlyPayments,
        yMaxYearly,
        bookingsByCountry,
        upcomingBookings,
        recentPayments,
    } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='flex flex-col xl:flex-row gap-4'>
                {/* Main Content Area */}
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 sm:p-4 min-w-0">
                    {/* Stats Cards - Always full width */}
                    <DashboardStatsCards data={metrics} />
                    
                    {/* Charts Container - Stack on mobile, side by side on larger screens */}
                    <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 w-full'>
                        {/* Graph Component - Full width on mobile */}
                        <div className="w-full lg:flex-1">
                            <GraphComponent
                                weeklyPayments={weeklyPayments}
                                yMaxWeekly={yMaxWeekly}
                                monthlyPayments={monthlyPayments}
                                yMaxMonthly={yMaxMonthly}
                                yearlyPayments={yearlyPayments}
                                yMaxYearly={yMaxYearly}
                            />
                        </div>
                        
                        {/* Pie Chart - Full width on mobile, flexible on larger screens */}
                        <div className="w-full lg:w-96 lg:flex-shrink-0">
                            <PieChart data={bookingsByCountry}/>
                        </div>
                    </div>
                    
                    {/* Table Component - Always full width */}
                    <TableComponent bookings={upcomingBookings}/>
                </div>
                
                {/* Notifications Panel - Hidden on mobile and tablet, shown on xl+ */}
                <div className="hidden xl:block xl:flex-shrink-0">
                    <div className="sticky top-4">
                        <NotificationsPanel payments={recentPayments}/>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}