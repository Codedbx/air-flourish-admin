import React, { useState } from 'react';
import { Search, MoreHorizontal, Calendar, Download } from 'lucide-react';
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

const InvoiceTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  const invoices = [
    {
      id: 1,
      user: {
        name: "Kate Morrison",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
      },
      bookingRef: "DEX236-763",
      tripType: "Venice Dream",
      date: "25 Jun-30 Jun",
      invoice: "Completed Project Stylings.pdf",
      status: "Paid"
    },
    {
      id: 2,
      user: {
        name: "Aliah Lane",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
      },
      bookingRef: "DEX236-763",
      tripType: "Safari Adventure",
      date: "25 Jun-30 Jun",
      invoice: "Completed Project Stylings.pdf",
      status: "Partially Paid"
    },
    {
      id: 3,
      user: {
        name: "Andi Lane",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
      },
      bookingRef: "DEX236-763",
      tripType: "Alpin Escape",
      date: "25 Jun-30 Jun",
      invoice: "Completed Project Stylings.pdf",
      status: "Complete"
    },
    {
      id: 4,
      user: {
        name: "Drew Cano",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
      },
      bookingRef: "DEX236-763",
      tripType: "Venice Dream",
      date: "25 Jun-30 Jun",
      invoice: "Completed Project Stylings.pdf",
      status: "Unpaid"
    },
    {
      id: 5,
      user: {
        name: "Koray Okumus",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
      },
      bookingRef: "DEX236-763",
      tripType: "Venice Dream",
      date: "25 Jun-30 Jun",
      invoice: "Completed Project Stylings.pdf",
      status: "Paid"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Partially Paid':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Complete':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
      case 'Unpaid':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
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
    if (selectedRows.size === invoices.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(invoices.map(invoice => invoice.id)));
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.tripType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.bookingRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F7F9FB] rounded-lg border">
      {/* Table Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
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
                checked={selectedRows.size === invoices.length && invoices.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Booking Ref</TableHead>
            <TableHead>Trip Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.map((invoice) => (
            <TableRow 
              key={invoice.id}
              className={selectedRows.has(invoice.id) ? 'bg-muted/50' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(invoice.id)}
                  onCheckedChange={() => handleSelectRow(invoice.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <img 
                    src={invoice.user.avatar} 
                    alt={invoice.user.name}
                    className="w-8 h-8 rounded-full object-cover mr-3"
                  />
                  <span className="font-medium">{invoice.user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{invoice.bookingRef}</TableCell>
              <TableCell className="font-medium">{invoice.tripType}</TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  {invoice.date}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="text-sm text-blue-600 underline mr-2 cursor-pointer hover:text-blue-800">
                    {invoice.invoice}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Download className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={getStatusColor(invoice.status)}
                >
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* View More Button */}
      <div className="flex justify-center p-4 border-t">
        <Button variant="outline" className="bg-black text-white hover:bg-gray-800 px-6">
          View More
        </Button>
      </div>
    </div>
  );
};

export default InvoiceTable;