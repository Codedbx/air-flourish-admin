import React, { useState } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { router } from '@inertiajs/react';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'hold':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'cancelled':
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    case 'finished':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'confirm':
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
  }
};

const TableComponent = ({ bookings }) => {
  // Sample data for demonstration
  const sampleBookings = [
    {
      id: 1,
      booking_reference: "BK001",
      guest_name: "Kate Morrison",
      package_title: "Venice Dream",
      created_at_human: "25 Jun 2024",
      status: "Hold",
      total_price_formatted: "$2,500"
    },
    {
      id: 2,
      booking_reference: "BK002",
      guest_name: "Aliah Lane",
      package_title: "Safari Adventure",
      created_at_human: "26 Jun 2024",
      status: "Cancelled",
      total_price_formatted: "$3,200"
    },
    {
      id: 3,
      booking_reference: "BK003",
      guest_name: "Andi Lane",
      package_title: "Alpine Escape",
      created_at_human: "27 Jun 2024",
      status: "Pending",
      total_price_formatted: "$1,800"
    },
    {
      id: 4,
      booking_reference: "BK004",
      guest_name: "Drew Cano",
      package_title: "Venice Dream",
      created_at_human: "28 Jun 2024",
      status: "Finished",
      total_price_formatted: "$2,500"
    },
    {
      id: 5,
      booking_reference: "BK005",
      guest_name: "Koray Okumus",
      package_title: "Alpine Escape",
      created_at_human: "29 Jun 2024",
      status: "Confirm",
      total_price_formatted: "$1,900"
    }
  ];

  const displayBookings = bookings || sampleBookings;
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
    // Navigate to bookings.show route with booking ID
    router.visit(route('bookings.show', booking.id));
  };

  const handleViewAllBookings = () => {
    // Navigate to bookings.index route
    router.visit(route('bookings.index'));
  };

  return (
    <div className="bg-white rounded-lg border">
      {/* Table Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <button 
          onClick={handleViewAllBookings}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          View All Bookings
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  checked={displayBookings.length > 0 && selectedRows.size === displayBookings.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="p-3 text-left font-medium">Guest</th>
              <th className="p-3 text-left font-medium">Package</th>
              <th className="p-3 text-left font-medium">Date</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Total</th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {displayBookings.map((booking) => (
              <tr
                key={booking.id}
                className={`border-b hover:bg-gray-50 ${selectedRows.has(booking.id) ? 'bg-gray-50' : ''}`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(booking.id)}
                    onChange={() => handleSelectRow(booking.id)}
                    className="rounded border-gray-300"
                  />
                </td>

                <td className="p-3">
                  <div className="font-medium">{booking.guest_name}</div>
                  <div className="text-sm text-gray-500">{booking.booking_reference}</div>
                </td>

                <td className="p-3">{booking.package_title || '—'}</td>

                <td className="p-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {booking.created_at_human}
                  </div>
                </td>

                <td className="p-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>

                <td className="p-3 font-medium">{booking.total_price_formatted}</td>

                <td className="p-3">
                  <button
                    onClick={() => handleViewBooking(booking)}
                    className="p-1 rounded hover:bg-gray-100"
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
  );
};

export default TableComponent;