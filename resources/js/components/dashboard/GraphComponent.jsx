

// // resources/js/components/dashboard/GraphComponent.jsx
// import React from 'react';
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { TrendingUp } from 'lucide-react';

// //
// // Props:
// //   • data: Array<{
// //       week: string,      // e.g. "May 5–May 11"
// //       total: number      // e.g. 12345.67
// //     }>
// //   • yAxisMax: number     // e.g. 2000 or 3000, as computed by the controller
// //
// export function GraphComponent({ data, yAxisMax }) {
//   if (!data || yAxisMax === undefined) {
//     return null;
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Weekly Payments</CardTitle>
//         <CardDescription>Last 6 Weeks</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <div style={{ width: '100%', height: 300 }}>
//           <ResponsiveContainer>
//             <BarChart
//               data={data}
//               margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />

//               {/* X-Axis: each week label rotated −45° so it never overflows */}
//               <XAxis
//                 dataKey="week"
//                 tickLine={false}
//                 axisLine={false}
//                 angle={-45}
//                 textAnchor="end"
//                 interval={0}
//                 tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
//                 height={50}
//               />

//               {/* Y-Axis: domain set to [0, yAxisMax], ticks at nice intervals */}
//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 domain={[0, yAxisMax]}
//                 tickFormatter={(value) => {
//                   if (value >= 1000) {
//                     // Show “1k”, “1.5k”, “2k”, etc.
//                     return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
//                   }
//                   return value.toString();
//                 }}
//                 tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
//                 tickCount={5}
//               />

//               <Tooltip
//                 formatter={(value) =>
//                   value.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })
//                 }
//                 labelFormatter={(label) => `Week: ${label}`}
//                 contentStyle={{
//                   fontSize: 12,
//                   borderRadius: '4px',
//                   borderColor: 'var(--border)',
//                 }}
//               />

//               {/* Bar width fixed at 20px so bars look uniform */}
//               <Bar
//                 dataKey="total"
//                 fill="var(--color-primary)"
//                 barSize={20}
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>

//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           {/* Ideally you compute a real “% trend” server-side and inject it here */}
//           Trending up this period <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total paid amounts per week
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

//
// Props:
//   • weeklyPayments:   Array<{ period: string, total: number }>
//   • yMaxWeekly:       number
//   • monthlyPayments:  Array<{ period: string, total: number }>
//   • yMaxMonthly:      number
//   • yearlyPayments:   Array<{ period: string, total: number }>
//   • yMaxYearly:       number
//
export function GraphComponent({
  weeklyPayments,
  yMaxWeekly,
  monthlyPayments,
  yMaxMonthly,
  yearlyPayments,
  yMaxYearly,
}) {
  const [scope, setScope] = useState('month');

  let chartData, yAxisMax, xAxisLabelFormat;
  if (scope === 'week') {
    chartData = weeklyPayments;
    yAxisMax = yMaxWeekly;
    xAxisLabelFormat = (val) => val;
  } else if (scope === 'year') {
    chartData = yearlyPayments;
    yAxisMax = yMaxYearly;
    xAxisLabelFormat = (val) => val;
  } else {
    chartData = monthlyPayments;
    yAxisMax = yMaxMonthly;
    xAxisLabelFormat = (val) => val;
  }

  if (!chartData || yAxisMax === undefined) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Total bookings</CardTitle>
          <CardDescription>
            {scope === 'week'
              ? 'Last 6 Weeks'
              : scope === 'year'
              ? 'Last 5 Years'
              : 'Last 6 Months'}
          </CardDescription>
        </div>
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </CardHeader>

      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={50}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                tickFormatter={xAxisLabelFormat}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, yAxisMax]}
                tickCount={5}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(
                      value % 1000 === 0 ? 0 : 1
                    )}k`;
                  }
                  return value.toString();
                }}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />

              <Tooltip
                formatter={(value) =>
                  value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }
                labelFormatter={(label) =>
                  `${scope.charAt(0).toUpperCase() + scope.slice(1)}: ${label}`
                }
                contentStyle={{
                  fontSize: 12,
                  borderRadius: '4px',
                  borderColor: 'var(--border)',
                }}
              />

              <Bar
                dataKey="total"
                barSize={20}
                radius={[4, 4, 0, 0]}
                className="fill-indigo-400/60"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total payment amounts
        </div>
      </CardFooter>
    </Card>
  );
}
