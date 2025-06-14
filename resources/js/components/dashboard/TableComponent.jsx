// import React, { useState } from 'react';
// import { Eye, Calendar } from 'lucide-react';
// import { router } from '@inertiajs/react';

// const getStatusColor = (status) => {
//   switch (status.toLowerCase()) {
//     case 'hold':
//       return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
//     case 'cancelled':
//       return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
//     case 'pending':
//       return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
//     case 'finished':
//       return 'bg-green-100 text-green-700 hover:bg-green-100';
//     case 'confirm':
//       return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
//     case 'completed':
//       return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
//     default:
//       return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
//   }
// };

// const TableComponent = ({ bookings }) => {

//   const displayBookings = bookings;
//   const [selectedRows, setSelectedRows] = useState(new Set());

//   const handleSelectRow = (id) => {
//     const next = new Set(selectedRows);
//     if (next.has(id)) {
//       next.delete(id);
//     } else {
//       next.add(id);
//     }
//     setSelectedRows(next);
//   };

//   const handleSelectAll = () => {
//     if (selectedRows.size === displayBookings.length) {
//       setSelectedRows(new Set());
//     } else {
//       setSelectedRows(new Set(displayBookings.map((b) => b.id)));
//     }
//   };

//   const handleViewBooking = (booking) => {
//     // Navigate to bookings.show route with booking ID
//     router.visit(route('bookings.show', booking.id));
//   };

//   const handleViewAllBookings = () => {
//     // Navigate to bookings.index route
//     router.visit(route('bookings.index'));
//   };

//   return (
//     <div className="bg-white rounded-lg border">
//       {/* Table Header */}
//       <div className="flex items-center justify-between p-6 border-b">
//         <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
//         <button 
//           onClick={handleViewAllBookings}
//           className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
//         >
//           View All Bookings
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b">
//               <th className="w-12 p-3 text-left">
//                 <input
//                   type="checkbox"
//                   checked={displayBookings.length > 0 && selectedRows.size === displayBookings.length}
//                   onChange={handleSelectAll}
//                   className="rounded border-gray-300"
//                 />
//               </th>
//               <th className="p-3 text-left font-medium">Guest</th>
//               <th className="p-3 text-left font-medium">Package</th>
//               <th className="p-3 text-left font-medium">Date</th>
//               <th className="p-3 text-left font-medium">Status</th>
//               <th className="p-3 text-left font-medium">Total</th>
//               <th className="w-12 p-3"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayBookings.map((booking) => (
//               <tr
//                 key={booking.id}
//                 className={`border-b hover:bg-gray-50 ${selectedRows.has(booking.id) ? 'bg-gray-50' : ''}`}
//               >
//                 <td className="p-3">
//                   <input
//                     type="checkbox"
//                     checked={selectedRows.has(booking.id)}
//                     onChange={() => handleSelectRow(booking.id)}
//                     className="rounded border-gray-300"
//                   />
//                 </td>

//                 <td className="p-3">
//                   <div className="font-medium">{booking.guest_name}</div>
//                   <div className="text-sm text-gray-500">{booking.booking_reference}</div>
//                 </td>

//                 <td className="p-3">{booking.package_title || '—'}</td>

//                 <td className="p-3">
//                   <div className="flex items-center">
//                     <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                     {booking.created_at_human}
//                   </div>
//                 </td>

//                 <td className="p-3">
//                   <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
//                     {booking.status}
//                   </span>
//                 </td>

//                 <td className="p-3 font-medium">{booking.total_price_formatted}</td>

//                 <td className="p-3">
//                   <button
//                     onClick={() => handleViewBooking(booking)}
//                     className="p-1 rounded hover:bg-gray-100"
//                     title="View booking details"
//                   >
//                     <Eye className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TableComponent;


// TableComponent.js
import React, { useState } from 'react';
import { Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'hold':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40';
    case 'cancelled':
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40';
    case 'finished':
      return 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40';
    case 'confirm':
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/40';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
  }
};

const TableComponent = ({ bookings }) => {
  const displayBookings = bookings;
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectRow = (id) => {
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === displayBookings.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(displayBookings.map((b) => b.id)));
    }
  };

  const handleViewBooking = (booking) => {
    router.visit(route('bookings.show', booking.id));
  };

  const handleViewAllBookings = () => {
    router.visit(route('bookings.index'));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors duration-200">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Bookings</h2>
        <button 
          onClick={handleViewAllBookings}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200 whitespace-nowrap"
        >
          View All Bookings
        </button>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="w-12 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={displayBookings.length > 0 && selectedRows.size === displayBookings.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-600"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                  Guest
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                  Package
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[100px]">
                  Total
                </th>
                <th className="w-12 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {displayBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 ${
                    selectedRows.has(booking.id) 
                      ? 'bg-gray-50 dark:bg-gray-800/50' 
                      : ''
                  }`}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(booking.id)}
                      onChange={() => handleSelectRow(booking.id)}
                      className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-600"
                    />
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {booking.guest_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.booking_reference}
                    </div>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {booking.package_title || '—'}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="truncate">{booking.created_at_human}</span>
                    </div>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {booking.total_price_formatted}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      title="View booking details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly message when table is scrollable */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 sm:hidden">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Scroll horizontally to view all columns
        </p>
      </div>
    </div>
  );
};

export default TableComponent;