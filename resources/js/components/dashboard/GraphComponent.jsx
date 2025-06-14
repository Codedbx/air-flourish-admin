// import React, { useState } from 'react';
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
// //   • weeklyPayments:   Array<{ period: string, total: number }>
// //   • yMaxWeekly:       number
// //   • monthlyPayments:  Array<{ period: string, total: number }>
// //   • yMaxMonthly:      number
// //   • yearlyPayments:   Array<{ period: string, total: number }>
// //   • yMaxYearly:       number
// //
// export function GraphComponent({
//   weeklyPayments,
//   yMaxWeekly,
//   monthlyPayments,
//   yMaxMonthly,
//   yearlyPayments,
//   yMaxYearly,
// }) {
//   const [scope, setScope] = useState('month');

//   let chartData, yAxisMax, xAxisLabelFormat;
//   if (scope === 'week') {
//     chartData = weeklyPayments;
//     yAxisMax = yMaxWeekly;
//     xAxisLabelFormat = (val) => val;
//   } else if (scope === 'year') {
//     chartData = yearlyPayments;
//     yAxisMax = yMaxYearly;
//     xAxisLabelFormat = (val) => val;
//   } else {
//     chartData = monthlyPayments;
//     yAxisMax = yMaxMonthly;
//     xAxisLabelFormat = (val) => val;
//   }

//   if (!chartData || yAxisMax === undefined) {
//     return null;
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="flex items-center justify-between">
//         <div>
//           <CardTitle>Total bookings</CardTitle>
//           <CardDescription>
//             {scope === 'week'
//               ? 'Last 6 Weeks'
//               : scope === 'year'
//               ? 'Last 5 Years'
//               : 'Last 6 Months'}
//           </CardDescription>
//         </div>
//         <select
//           value={scope}
//           onChange={(e) => setScope(e.target.value)}
//           className="border border-gray-300 rounded px-2 py-1 text-sm"
//         >
//           <option value="week">Week</option>
//           <option value="month">Month</option>
//           <option value="year">Year</option>
//         </select>
//       </CardHeader>

//       <CardContent>
//         <div style={{ width: '100%', height: 300 }}>
//           <ResponsiveContainer>
//             <BarChart
//               data={chartData}
//               margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />

//               <XAxis
//                 dataKey="period"
//                 tickLine={false}
//                 axisLine={false}
//                 angle={-45}
//                 textAnchor="end"
//                 interval={0}
//                 height={50}
//                 tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
//                 tickFormatter={xAxisLabelFormat}
//               />

//               <YAxis
//                 tickLine={false}
//                 axisLine={false}
//                 domain={[0, yAxisMax]}
//                 tickCount={5}
//                 tickFormatter={(value) => {
//                   if (value >= 1000) {
//                     return `${(value / 1000).toFixed(
//                       value % 1000 === 0 ? 0 : 1
//                     )}k`;
//                   }
//                   return value.toString();
//                 }}
//                 tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
//               />

//               <Tooltip
//                 formatter={(value) =>
//                   value.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })
//                 }
//                 labelFormatter={(label) =>
//                   `${scope.charAt(0).toUpperCase() + scope.slice(1)}: ${label}`
//                 }
//                 contentStyle={{
//                   fontSize: 12,
//                   borderRadius: '4px',
//                   borderColor: 'var(--border)',
//                 }}
//               />

//               <Bar
//                 dataKey="total"
//                 barSize={20}
//                 radius={[4, 4, 0, 0]}
//                 className="fill-indigo-400/60"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>

//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Trending this period <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing total payment amounts
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// GraphComponent.js
import React, { useState, useEffect } from 'react';
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

export function GraphComponent({
  weeklyPayments,
  yMaxWeekly,
  monthlyPayments,
  yMaxMonthly,
  yearlyPayments,
  yMaxYearly,
}) {
  const [scope, setScope] = useState('month');
  const [isDark, setIsDark] = useState(false);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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
    <Card className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-gray-900 dark:text-gray-100">Total bookings</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
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
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
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
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? 'rgb(75 85 99)' : 'rgb(229 231 235)'}
              />

              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={50}
                tick={{ 
                  fontSize: 10, 
                  fill: isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)',
                }}
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
                tick={{ 
                  fontSize: 10, 
                  fill: isDark ? 'rgb(156 163 175)' : 'rgb(107 114 128)',
                }}
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
                  backgroundColor: isDark ? 'rgb(31 41 55)' : 'rgb(255 255 255)',
                  border: `1px solid ${isDark ? 'rgb(75 85 99)' : 'rgb(229 231 235)'}`,
                  color: isDark ? 'rgb(243 244 246)' : 'rgb(17 24 39)',
                  boxShadow: isDark 
                    ? '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)' 
                    : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }}
                cursor={{ fill: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(107, 114, 128, 0.1)' }}
              />

              <Bar
                dataKey="total"
                barSize={20}
                radius={[4, 4, 0, 0]}
                fill={isDark ? 'rgb(129 140 248 / 0.7)' : 'rgb(129 140 248 / 0.6)'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-gray-900 dark:text-gray-100">
          Trending this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-gray-500 dark:text-gray-400">
          Showing total payment amounts
        </div>
      </CardFooter>
    </Card>
  );
}