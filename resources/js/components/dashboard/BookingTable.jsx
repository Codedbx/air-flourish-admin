import React, { useState } from 'react';
import { Search, MoreHorizontal, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const TableComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  const trips = [
    {
      id: 1,
      user: {
        name: "Kate Morrison",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
      },
      package: "Venice Dream",
      duration: "5D-4N",
      date: "25 Jun-30 Jun",
      status: "Hold",
      statusVariant: "secondary"
    },
    {
      id: 2,
      user: {
        name: "Aliah Lane",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
      },
      package: "Safari Adventure",
      duration: "4D-3N",
      date: "25 Jun-30 Jun",
      status: "Cancelled",
      statusVariant: "outline"
    },
    {
      id: 3,
      user: {
        name: "Andi Lane",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      },
      package: "Alpin Escape",
      duration: "4D-3N", 
      date: "25 Jun-30 Jun",
      status: "Pending",
      statusVariant: "default"
    },
    {
      id: 4,
      user: {
        name: "Drew Cano",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
      },
      package: "Venice Dream",
      duration: "5D-4N",
      date: "25 Jun-30 Jun", 
      status: "Finished",
      statusVariant: "default"
    },
    {
      id: 5,
      user: {
        name: "Koray Okumus",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
      },
      package: "Alpin Escape",
      duration: "6D-5N",
      date: "25 Jun-30 Jun",
      status: "Confirm", 
      statusVariant: "default"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hold':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Finished':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Confirm':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === trips.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(trips.map(trip => trip.id)));
    }
  };

  const filteredTrips = trips.filter(trip =>
    trip.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.package.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border">
      {/* Table Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Trips</h2>
        
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-black hover:bg-gray-800">
            Delete
          </Button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 w-48"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 text-xs font-medium text-muted-foreground bg-muted border rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === trips.length && trips.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Package Name</TableHead>
            <TableHead>Destinations</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTrips.map((trip) => (
            <TableRow 
              key={trip.id}
              className={selectedRows.has(trip.id) ? 'bg-muted/50' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(trip.id)}
                  onCheckedChange={() => handleSelectRow(trip.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <img 
                    src={trip.user.avatar} 
                    alt={trip.user.name}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <span className="font-medium">{trip.user.name}</span>
                </div>
              </TableCell>
              <TableCell>{trip.package}</TableCell>
              <TableCell>{trip.duration}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  {trip.date}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(trip.status)}
                >
                  {trip.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;