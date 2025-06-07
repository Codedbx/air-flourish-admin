

// import React, { useMemo } from 'react';
// import { Pie, PieChart as RechartsPieChart, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
// //       status: string,   // e.g. "completed", "pending", etc.
// //       count: number     // e.g. 1200
// //     }>
// //
// // We’ll assign a simple color palette. Adjust the colors as you wish.
// //
// const STATUS_COLORS = {
//   completed: 'var(--color-green)',   // e.g. green slice
//   pending: 'var(--color-yellow)',     // e.g. yellow slice
//   cancelled: 'var(--color-red)',      // e.g. red slice
//   // …add more as needed
//   default: 'var(--color-gray)',
// };

// export function PieChart({ data }) {
//   if (!data) {
//     return null;
//   }

//   // Compute total count for center text:
//   const total = useMemo(() => {
//     return data.reduce((sum, entry) => sum + entry.count, 0);
//   }, [data]);

//   return (
//     <Card className="flex flex-col w-full">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Booking Status</CardTitle>
//         <CardDescription>Distribution (Completed vs. Pending etc.)</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <div style={{ width: '100%', height: 240 }}>
//           <ResponsiveContainer>
//             <RechartsPieChart>
//               <Tooltip
//                 formatter={(value) => value.toLocaleString()}
//                 labelFormatter={(label) => `Status: ${label}`}
//               />
//               <Pie
//                 data={data}
//                 dataKey="count"
//                 nameKey="status"
//                 innerRadius={60}
//                 outerRadius={100}
//                 paddingAngle={3}
//                 labelLine={false}
//                 label={({ name, percent }) =>
//                   `${name} ${(percent * 100).toFixed(0)}%`
//                 }
//               >
//                 {data.map((entry, index) => {
//                   const color =
//                     STATUS_COLORS[entry.status] || STATUS_COLORS.default;
//                   return <Cell key={`cell-${index}`} fill={color} />;
//                 })}
//               </Pie>
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           {/* You can compute a real “trend” server‐side and show it */}
//           Trending this period <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Showing booking counts by status
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

import React, { useMemo } from 'react';
import {
  Pie,
  PieChart as RechartsPieChart,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
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


export function PieChart({ data }) {
  if (!data) {
    return null;
  }

  const totalBookings = useMemo(() => {
    return data.reduce((sum, entry) => sum + entry.count, 0);
  }, [data]);

  const COLORS = [
    '#60A5FA', // indigo-400
    '#34D399', // emerald-400
    '#FBBF24', // yellow-400
    '#F87171', // red-400
    '#A78BFA', // purple-400
  ];

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Booking by Location</CardTitle>
        <CardDescription>All Time Distribution</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <RechartsPieChart>
              <Tooltip
                formatter={(value, name) => {
                  const percent = ((value / totalBookings) * 100).toFixed(1);
                  return [`${value} (${percent}%)`, name];
                }}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: '4px',
                  borderColor: 'var(--border)',
                }}
              />

              <Pie
                data={data}
                dataKey="count"
                nameKey="country"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                labelLine={false}
                // label={({ percent, name }) =>
                //   `${name} ${(percent * 100).toFixed(0)}%`
                // }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`slice-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending all time <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing booking distribution by country
        </div>
      </CardFooter>
    </Card>
  );
}
