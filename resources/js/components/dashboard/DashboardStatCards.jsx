// import { TrendingUp, TrendingDown } from 'lucide-react';

// const DashboardStatsCards = ({ data }) => {
//   // If no data was passed (e.g. still loading), render nothing or a simple placeholder:
//   if (!data) {
//     return null;
//   }

//   // Build an array of objects so we can map them into 4 cards:
//   const stats = [
//     {
//       title: 'Total bookings',
//       // Format as integer with commas:
//       value: data.total_bookings.toLocaleString(),
//       // No change arrow by default; you can inject a "change" prop later if needed.
//       change: null,
//       positive: null,
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Total payments',
//       // Format as currency‐like string. Adjust toLocaleString options as needed:
//       value: data.total_payments.toLocaleString(undefined, {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//       change: null,
//       positive: null,
//       bgColor: 'bg-purple-50',
//     },
//     {
//       title: 'Completed bookings',
//       value: data.completed_bookings.toLocaleString(),
//       change: null,
//       positive: null,
//       bgColor: 'bg-cyan-50',
//     },
//     {
//       title: 'Unique visitors',
//       value: data.unique_visitors.toLocaleString(),
//       change: null,
//       positive: null,
//       bgColor: 'bg-gray-100',
//     },
//   ];

//   return (
//     <div className="bg-white">
//       {/* Stats Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
//           >
//             {/* Card Header */}
//             <div className="mb-4">
//               <h3 className="text-sm font-medium text-gray-600 mb-2">
//                 {stat.title}
//               </h3>
//               <div className="flex items-end justify-between">
//                 <span className="text-3xl font-bold text-gray-900">
//                   {stat.value}
//                 </span>

//                 {/* If you ever pass a change arrow, this block will render it. */}
//                 {stat.change && (
//                   <div className="flex items-center space-x-1">
//                     <span
//                       className={`text-sm font-medium ${
//                         stat.positive ? 'text-green-600' : 'text-red-600'
//                       }`}
//                     >
//                       {stat.change}
//                     </span>
//                     {stat.positive ? (
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                     ) : (
//                       <TrendingDown className="h-4 w-4 text-red-600" />
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardStatsCards;


// DashboardStatsCards.js
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardStatsCards = ({ data }) => {
  if (!data) {
    return null;
  }

  const stats = [
    {
      title: 'Total bookings',
      value: data.total_bookings.toLocaleString(),
      change: null,
      positive: null,
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
    },
    {
      title: 'Total payments',
      value: data.total_payments.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      change: null,
      positive: null,
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      borderColor: 'border-purple-100 dark:border-purple-900/50',
    },
    {
      title: 'Completed bookings',
      value: data.completed_bookings.toLocaleString(),
      change: null,
      positive: null,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/50',
      borderColor: 'border-cyan-100 dark:border-cyan-900/50',
    },
    {
      title: 'Unique visitors',
      value: data.unique_visitors.toLocaleString(),
      change: null,
      positive: null,
      bgColor: 'bg-gray-50 dark:bg-gray-900/50',
      borderColor: 'border-gray-100 dark:border-gray-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor} transition-colors duration-200`}
          >
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.title}
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </span>
                
                {stat.change && (
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-sm font-medium ${
                        stat.positive 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                    {stat.positive ? (
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatsCards;