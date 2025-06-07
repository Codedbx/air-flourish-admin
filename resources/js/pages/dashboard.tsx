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
            <div className='flex'>
                 <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <DashboardStatsCards data={metrics} />
                    <div className='flex gap-6 w-full'>
                        {/* <GraphComponent data={weeklyPayments}/> */}
                        <GraphComponent
                            weeklyPayments={weeklyPayments}
                            yMaxWeekly={yMaxWeekly}
                            monthlyPayments={monthlyPayments}
                            yMaxMonthly={yMaxMonthly}
                            yearlyPayments={yearlyPayments}
                            yMaxYearly={yMaxYearly}
                        />
                        <PieChart data={bookingsByCountry}/>
                    </div>
                    <TableComponent bookings={upcomingBookings}/>
                </div>
                <div className="hidden xl:block">
                    <NotificationsPanel payments={recentPayments}/>
                </div>
            </div>
           
        </AppLayout>
    );
}
