// import { Head, useForm, router, Link } from "@inertiajs/react"
// import { JSX, useEffect, useState } from "react"
// import AppLayout from "@/layouts/app-layout"
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Search, ChevronUp, ChevronDown, Calendar, MoreHorizontal,
//   Filter, Download, Trash2, RefreshCw, Plus, User, Package,
//   DollarSign, Clock, Eye, CheckCircle, XCircle, AlertCircle,
//   Users, FileText, Settings, ArrowUpDown
// } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"

// type RawBooking = {
//   id: number
//   booking_reference: string
//   guest_full_name: string
//   user: { name: string } | null
//   package: { title: string; owner: { name: string } }
//   total_price: number
//   status: string
//   created_at: string
// }

// interface BookingsProps {
//   filters: Record<string, string>
//   bookings: {
//     data: RawBooking[]
//     links: { url: string | null; label: string; active: boolean }[]
//     meta: { current_page: number; last_page: number; per_page: number; total: number }
//   }
// }

// export default function Bookings({ filters, bookings }: BookingsProps) {
//   // Form state
//   const { data, setData, reset } = useForm({
//     search: filters.search || "",
//     status: filters.status || "all",
//     owner_search: filters.owner_search || "",
//     sort_by: filters.sort_by || "created_at",
//     sort_order: filters.sort_order || "desc",
//     per_page: filters.per_page || "10",
//   })

//   // Selection
//   const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

//   // Fetch data
//   const fetchData = () => {
//     router.get(route("bookings.index"), { ...data }, { preserveState: true })
//   }

//   // Handlers
//   const handleSort = (column: string) => {
//     setData(prev => ({
//       ...prev,
//       sort_by: column,
//       sort_order: prev.sort_by === column && prev.sort_order === "asc" ? "desc" : "asc",
//     }))
//     fetchData()
//   }

//   const applyFilters = () => fetchData()
//   const clearFilters = () => { 
//     reset("search","status","owner_search","sort_by","sort_order","per_page"); 
//     fetchData() 
//   }

//   const toggleRow = (id: number) => setSelectedRows(prev => { 
//     const nxt = new Set(prev); 
//     nxt.has(id) ? nxt.delete(id) : nxt.add(id); 
//     return nxt 
//   })
  
//   const toggleAll = () => setSelectedRows(prev => 
//     prev.size === bookings.data.length ? new Set() : new Set(bookings.data.map(b => b.id))
//   )

//   const getStatusColor = (status: string) => {
//     switch(status.toLowerCase()){
//       case "confirmed": return "bg-emerald-100 text-emerald-800 border-emerald-200"
//       case "pending": return "bg-amber-100 text-amber-800 border-amber-200"
//       case "cancelled": return "bg-red-100 text-red-800 border-red-200"
//       default: return "bg-slate-100 text-slate-800 border-slate-200"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch(status.toLowerCase()){
//       case "confirmed": return <CheckCircle className="w-3 h-3" />
//       case "pending": return <AlertCircle className="w-3 h-3" />
//       case "cancelled": return <XCircle className="w-3 h-3" />
//       default: return <Clock className="w-3 h-3" />
//     }
//   }

//   const SortIcon = ({ column }: { column: string }) => {
//     if (data.sort_by !== column) return <ArrowUpDown className="inline w-3 h-3 ml-1 text-muted-foreground" />
//     return data.sort_order === "asc"
//       ? <ChevronUp className="inline w-3 h-3 ml-1 text-primary" />
//       : <ChevronDown className="inline w-3 h-3 ml-1 text-primary" />
//   }

//   const hasFilters = Object.keys(filters).some(
//     k => filters[k] && !["sort_by","sort_order","per_page"].includes(k)
//   )

//   const formatColumnHeader = (column: string) => {
//     const labels: Record<string, string> = {
//       'booking_reference': 'Reference',
//       'guest_full_name': 'Guest',
//       'package.title': 'Package',
//       'package.owner.name': 'Agent',
//       'total_price': 'Amount',
//       'status': 'Status',
//       'created_at': 'Date Created'
//     }
//     return labels[column] || column.split('.').pop()?.replace('_', ' ')
//   }

//   const getColumnIcon = (column: string) => {
//     const icons: Record<string, JSX.Element> = {
//       'booking_reference': <FileText className="w-4 h-4 mr-2" />,
//       'guest_full_name': <User className="w-4 h-4 mr-2" />,
//       'package.title': <Package className="w-4 h-4 mr-2" />,
//       'package.owner.name': <Users className="w-4 h-4 mr-2" />,
//       'total_price': <DollarSign className="w-4 h-4 mr-2" />,
//       'status': <Settings className="w-4 h-4 mr-2" />,
//       'created_at': <Calendar className="w-4 h-4 mr-2" />
//     }
//     return icons[column] || null
//   }

//   return (
    // <AppLayout>
    //   <Head title="Bookings Management" />
    //   <div className="min-h-screen bg-slate-50/30">
    //     <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    //       {/* Header Section */}
    //       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    //           <div className="space-y-1">
    //             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
    //               <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
    //                 <FileText className="w-5 h-5 text-primary" />
    //               </div>
    //               Bookings Management
    //             </h1>
    //             <p className="text-slate-600">Manage and track all booking reservations</p>
    //           </div>
    //           <div className="flex flex-wrap gap-3">
    //             <Button variant="outline" size="sm" onClick={fetchData} className="shadow-sm">
    //               <RefreshCw className="mr-2 w-4 h-4" /> 
    //               Refresh
    //             </Button>
    //             <Button variant="outline" size="sm" className="shadow-sm">
    //               <Download className="mr-2 w-4 h-4" /> 
    //               Export
    //             </Button>
    //             <Link href="localhost:5173">
    //               <Button size="sm" className="shadow-sm">
    //                 <Plus className="mr-2 w-4 h-4" /> 
    //                 New Booking
    //               </Button>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Stats Cards */}
    //       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    //         <Card className="bg-white shadow-sm border-slate-200">
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="text-sm font-medium text-slate-600">Total Bookings</p>
    //                 <p className="text-2xl font-bold text-slate-900">{bookings.meta?.total || 0}</p>
    //               </div>
    //               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
    //                 <FileText className="w-6 h-6 text-blue-600" />
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //         <Card className="bg-white shadow-sm border-slate-200">
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="text-sm font-medium text-slate-600">Confirmed</p>
    //                 <p className="text-2xl font-bold text-emerald-600">
    //                   {bookings.data.filter(b => b.status.toLowerCase() === 'confirmed').length}
    //                 </p>
    //               </div>
    //               <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
    //                 <CheckCircle className="w-6 h-6 text-emerald-600" />
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //         <Card className="bg-white shadow-sm border-slate-200">
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="text-sm font-medium text-slate-600">Pending</p>
    //                 <p className="text-2xl font-bold text-amber-600">
    //                   {bookings.data.filter(b => b.status.toLowerCase() === 'pending').length}
    //                 </p>
    //               </div>
    //               <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
    //                 <AlertCircle className="w-6 h-6 text-amber-600" />
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //         <Card className="bg-white shadow-sm border-slate-200">
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="text-sm font-medium text-slate-600">Cancelled</p>
    //                 <p className="text-2xl font-bold text-red-600">
    //                   {bookings.data.filter(b => b.status.toLowerCase() === 'cancelled').length}
    //                 </p>
    //               </div>
    //               <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
    //                 <XCircle className="w-6 h-6 text-red-600" />
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </div>

    //       {/* Filters Card */}
    //       <Card className="bg-white shadow-sm border-slate-200">
    //         <CardHeader className="pb-4">
    //           <CardTitle className="flex items-center gap-2 text-lg">
    //             <Filter className="w-5 h-5" />
    //             Filters & Search
    //             {hasFilters && (
    //               <Badge variant="secondary" className="ml-2">
    //                 Active
    //               </Badge>
    //             )}
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="space-y-6">
    //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
    //             {/* Search */}
    //             <div className="col-span-1 md:col-span-2 relative">
    //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    //               <Input 
    //                 placeholder="Search reference or guest name..." 
    //                 value={data.search} 
    //                 onChange={e => setData('search', e.target.value)} 
    //                 className="pl-10 h-11 border-slate-300 focus:border-primary focus:ring-primary/20" 
    //               />
    //             </div>

    //             {/* Status Filter */}
    //             <Select value={data.status} onValueChange={v => setData('status', v)}>
    //               <SelectTrigger className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20">
    //                 <SelectValue placeholder="Filter by status" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="all">All Statuses</SelectItem>
    //                 <SelectItem value="pending">Pending</SelectItem>
    //                 <SelectItem value="confirmed">Confirmed</SelectItem>
    //                 <SelectItem value="cancelled">Cancelled</SelectItem>
    //               </SelectContent>
    //             </Select>

    //             {/* Agent Search */}
    //             <div className="relative">
    //               <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    //               <Input 
    //                 placeholder="Search agent..." 
    //                 value={data.owner_search} 
    //                 onChange={e => setData('owner_search', e.target.value)} 
    //                 className="pl-10 h-11 border-slate-300 focus:border-primary focus:ring-primary/20" 
    //               />
    //             </div>

    //             {/* Per Page */}
    //             <Select value={data.per_page} onValueChange={v => setData('per_page', v)}>
    //               <SelectTrigger className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20">
    //                 <SelectValue placeholder="Per page" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="10">10 per page</SelectItem>
    //                 <SelectItem value="25">25 per page</SelectItem>
    //                 <SelectItem value="50">50 per page</SelectItem>
    //                 <SelectItem value="100">100 per page</SelectItem>
    //               </SelectContent>
    //             </Select>

    //             {/* Actions */}
    //             <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 flex gap-2">
    //               <Button onClick={applyFilters} className="flex-1 h-11 shadow-sm">
    //                 <Filter className="mr-2 w-4 h-4" />
    //                 Apply
    //               </Button>
    //               <Button variant="outline" onClick={clearFilters} className="flex-1 h-11 shadow-sm">
    //                 Clear
    //               </Button>
    //             </div>
    //           </div>

    //           {/* Bulk Actions */}
    //           {selectedRows.size > 0 && (
    //             <>
    //               <Separator />
    //               <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
    //                 <span className="text-sm font-medium text-slate-700">
    //                   {selectedRows.size} booking{selectedRows.size !== 1 ? 's' : ''} selected
    //                 </span>
    //                 <div className="flex gap-2">
    //                   <Button size="sm" variant="outline">
    //                     <Download className="mr-2 w-4 h-4" />
    //                     Export Selected
    //                   </Button>
    //                   <Button size="sm" variant="outline">
    //                     <Trash2 className="mr-2 w-4 h-4" />
    //                     Delete Selected
    //                   </Button>
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </CardContent>
    //       </Card>

    //       {/* Table Card */}
    //       <Card className="bg-white shadow-sm border-slate-200">
    //         <div className="overflow-hidden">
    //           <Table>
    //             <TableHeader>
    //               <TableRow className="border-slate-200 bg-slate-50/50">
    //                 <TableHead className="w-14 py-4">
    //                   <Checkbox 
    //                     checked={selectedRows.size === bookings.data.length && bookings.data.length > 0} 
    //                     onCheckedChange={toggleAll}
    //                     className="border-slate-300"
    //                   />
    //                 </TableHead>
    //                 {['booking_reference','guest_full_name','package.title','package.owner.name','total_price','status','created_at'].map((col) => (
    //                   <TableHead 
    //                     key={col} 
    //                     className="cursor-pointer hover:bg-slate-100 transition-colors py-4 font-semibold text-slate-700" 
    //                     onClick={() => handleSort(col)}
    //                   >
    //                     <div className="flex items-center">
    //                       {getColumnIcon(col)}
    //                       {formatColumnHeader(col)}
    //                       <SortIcon column={col} />
    //                     </div>
    //                   </TableHead>
    //                 ))}
    //                 <TableHead className="w-20 py-4 text-center font-semibold text-slate-700">Actions</TableHead>
    //               </TableRow>
    //             </TableHeader>
    //             <TableBody>
    //               {bookings.data.length === 0 ? (
    //                 <TableRow>
    //                   <TableCell colSpan={9} className="py-12 text-center">
    //                     <div className="flex flex-col items-center gap-4">
    //                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
    //                         <FileText className="w-8 h-8 text-slate-400" />
    //                       </div>
    //                       <div className="space-y-2">
    //                         <p className="text-lg font-medium text-slate-900">No bookings found</p>
    //                         <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
    //                       </div>
    //                     </div>
    //                   </TableCell>
    //                 </TableRow>
    //               ) : bookings.data.map((booking, index) => (
    //                 <TableRow 
    //                   key={booking.id} 
    //                   className={`
    //                     border-slate-200 hover:bg-slate-50/50 transition-colors
    //                     ${selectedRows.has(booking.id) ? 'bg-primary/5 border-primary/20' : ''}
    //                     ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
    //                   `}
    //                 >
    //                   <TableCell className="py-4">
    //                     <Checkbox 
    //                       checked={selectedRows.has(booking.id)} 
    //                       onCheckedChange={() => toggleRow(booking.id)}
    //                       className="border-slate-300"
    //                     />
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="font-medium text-slate-900">{booking.booking_reference}</div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="flex items-center gap-2">
    //                       <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
    //                         <User className="w-4 h-4 text-slate-600" />
    //                       </div>
    //                       <span className="font-medium text-slate-900">
    //                         {booking.user?.name || booking.guest_full_name}
    //                       </span>
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="max-w-xs truncate" title={booking.package.title}>
    //                       <span className="font-medium text-slate-900">{booking.package.title}</span>
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="flex items-center gap-2">
    //                       <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
    //                         <Users className="w-3 h-3 text-blue-600" />
    //                       </div>
    //                       <span className="text-slate-700">{booking.package.owner.name}</span>
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="font-semibold text-slate-900 flex items-center gap-1">
    //                       <DollarSign className="w-4 h-4 text-slate-500" />
    //                       {booking.total_price.toLocaleString()}
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 w-fit border`}>
    //                       {getStatusIcon(booking.status)}
    //                       {booking.status}
    //                     </Badge>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <div className="flex items-center gap-2 text-slate-600">
    //                       <Calendar className="w-4 h-4" />
    //                       {new Date(booking.created_at).toLocaleDateString()}
    //                     </div>
    //                   </TableCell>
    //                   <TableCell className="py-4">
    //                     <DropdownMenu>
    //                       <DropdownMenuTrigger asChild>
    //                         <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-slate-100">
    //                           <MoreHorizontal className="w-4 h-4" />
    //                         </Button>
    //                       </DropdownMenuTrigger>
    //                       <DropdownMenuContent align="end" className="w-48">
    //                         <DropdownMenuItem asChild>
    //                           <Link href={route('bookings.show', booking.id)} className="flex items-center gap-2">
    //                             <Eye className="w-4 h-4" />
    //                             View Details
    //                           </Link>
    //                         </DropdownMenuItem>
    //                         <DropdownMenuSeparator />
    //                         <DropdownMenuItem 
    //                           onClick={() => router.post(route('bookings.confirm', booking.id))}
    //                           className="flex items-center gap-2 text-emerald-600"
    //                         >
    //                           <CheckCircle className="w-4 h-4" />
    //                           Confirm Booking
    //                         </DropdownMenuItem>
    //                         <DropdownMenuItem 
    //                           onClick={() => router.post(route('bookings.cancel', booking.id))}
    //                           className="flex items-center gap-2 text-red-600"
    //                         >
    //                           <XCircle className="w-4 h-4" />
    //                           Cancel Booking
    //                         </DropdownMenuItem>
    //                       </DropdownMenuContent>
    //                     </DropdownMenu>
    //                   </TableCell>
    //                 </TableRow>
    //               ))}
    //             </TableBody>
    //           </Table>
    //         </div>
    //       </Card>

    //       {/* Enhanced Pagination */}
    //       <Card className="bg-white shadow-sm border-slate-200">
    //         <CardContent className="p-6">
    //           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
    //             <div className="text-sm text-slate-600 flex items-center gap-2">
    //               <FileText className="w-4 h-4" />
    //               Showing <span className="font-medium">{bookings.data.length}</span> of{' '}
    //               <span className="font-medium">{bookings.meta?.total || 0}</span> bookings
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               {bookings.links.map((link, idx) => (
    //                 <Link 
    //                   key={idx} 
    //                   href={link.url || '#'} 
    //                   className={`
    //                     px-4 py-2 border rounded-lg text-sm font-medium transition-colors
    //                     ${link.active 
    //                       ? 'bg-primary text-white border-primary shadow-sm' 
    //                       : 'hover:bg-slate-50 border-slate-300 text-slate-700'
    //                     }
    //                   `} 
    //                   dangerouslySetInnerHTML={{ __html: link.label }} 
    //                 />
    //               ))}
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   </div>
    // </AppLayout>
//   )
// }


"use client"

import { Head, useForm, router, Link } from "@inertiajs/react"
import { JSX, useEffect, useState } from "react"
import AppLayout from "@/layouts/app-layout"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search, ChevronUp, ChevronDown, Calendar, MoreHorizontal,
  Filter, Download, Trash2, RefreshCw, Plus, User, Package,
  DollarSign, Clock, Eye, CheckCircle, XCircle, AlertCircle,
  Users, FileText, Settings, ArrowUpDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type RawBooking = {
  id: number
  booking_reference: string
  guest_full_name: string
  user: { name: string } | null
  package: { title: string; owner: { name: string } }
  total_price: number
  status: string
  created_at: string
}

interface BookingsProps {
  filters: Record<string, string>
  bookings: {
    data: RawBooking[]
    links: { url: string | null; label: string; active: boolean }[]
    meta: { current_page: number; last_page: number; per_page: number; total: number }
  }
}

export default function Bookings({ filters, bookings }: BookingsProps) {
  // Form state
  const { data, setData, reset } = useForm({
    search: filters.search || "",
    status: filters.status || "all",
    owner_search: filters.owner_search || "",
    sort_by: filters.sort_by || "created_at",
    sort_order: filters.sort_order || "desc",
    per_page: filters.per_page || "10",
  })

  // Selection
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  // Fetch data (only non-empty params)
  const fetchData = () => {
    const params = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value && !(key === 'status' && value === 'all')
      )
    )
    router.get(route("bookings.index"), params, { preserveState: true })
  }

  // Handlers
  const handleSort = (column: string) => {
    setData(prev => ({
      ...prev,
      sort_by: column,
      sort_order: prev.sort_by === column && prev.sort_order === "asc" ? "desc" : "asc",
    }))
    fetchData()
  }

  const applyFilters = () => fetchData()
  const clearFilters = () => {
    reset("search","status","owner_search","sort_by","sort_order","per_page")
    router.get(route("bookings.index"))
  }

  const toggleRow = (id: number) => setSelectedRows(prev => {
    const nxt = new Set(prev)
    nxt.has(id) ? nxt.delete(id) : nxt.add(id)
    return nxt
  })
  
  const toggleAll = () => setSelectedRows(prev => 
    prev.size === bookings.data.length ? new Set() : new Set(bookings.data.map(b => b.id))
  )

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()){
      case "confirmed": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()){
      case "confirmed": return <CheckCircle className="w-3 h-3" />
      case "pending": return <AlertCircle className="w-3 h-3" />
      case "cancelled": return <XCircle className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (data.sort_by !== column) return <ArrowUpDown className="inline w-3 h-3 ml-1 text-muted-foreground" />
    return data.sort_order === "asc"
      ? <ChevronUp className="inline w-3 h-3 ml-1 text-primary" />
      : <ChevronDown className="inline w-3 h-3 ml-1 text-primary" />
  }

  const hasFilters = Object.keys(filters).some(
    k => filters[k] && !["sort_by","sort_order","per_page"].includes(k)
  )

  const formatColumnHeader = (column: string) => {
    const labels: Record<string, string> = {
      'booking_reference': 'Reference',
      'guest_full_name': 'Guest',
      'package.title': 'Package',
      'package.owner.name': 'Agent',
      'total_price': 'Amount',
      'status': 'Status',
      'created_at': 'Date Created'
    }
    return labels[column] || column.split('.').pop()?.replace('_', ' ')
  }

  const getColumnIcon = (column: string) => {
    const icons: Record<string, JSX.Element> = {
      'booking_reference': <FileText className="w-4 h-4 mr-2" />,
      'guest_full_name': <User className="w-4 h-4 mr-2" />,
      'package.title': <Package className="w-4 h-4 mr-2" />,
      'package.owner.name': <Users className="w-4 h-4 mr-2" />,
      'total_price': <DollarSign className="w-4 h-4 mr-2" />,
      'status': <Settings className="w-4 h-4 mr-2" />,
      'created_at': <Calendar className="w-4 h-4 mr-2" />
    }
    return icons[column] || null
  }

  return (
        <AppLayout>
      <Head title="Bookings Management" />
      <div className="min-h-screen bg-slate-50/30">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  Bookings Management
                </h1>
                <p className="text-slate-600">Manage and track all booking reservations</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={fetchData} className="shadow-sm">
                  <RefreshCw className="mr-2 w-4 h-4" /> 
                  Refresh
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Download className="mr-2 w-4 h-4" /> 
                  Export
                </Button>
                <Link href="localhost:5173">
                  <Button size="sm" className="shadow-sm">
                    <Plus className="mr-2 w-4 h-4" /> 
                    New Booking
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Filters Card */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filters & Search
                {hasFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Search */}
                <div className="col-span-1 md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search reference or guest name..." 
                    value={data.search} 
                    onChange={e => setData('search', e.target.value)} 
                    className="pl-10 h-11 border-slate-300 focus:border-primary focus:ring-primary/20" 
                  />
                </div>

                {/* Status Filter */}
                <Select value={data.status} onValueChange={v => setData('status', v)}>
                  <SelectTrigger className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Agent Search */}
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search agent..." 
                    value={data.owner_search} 
                    onChange={e => setData('owner_search', e.target.value)} 
                    className="pl-10 h-11 border-slate-300 focus:border-primary focus:ring-primary/20" 
                  />
                </div>

                {/* Per Page */}
                <Select value={data.per_page} onValueChange={v => setData('per_page', v)}>
                  <SelectTrigger className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>

                {/* Actions */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 flex gap-2">
                  <Button onClick={applyFilters} className="flex-1 h-11 shadow-sm">
                    <Filter className="mr-2 w-4 h-4" />
                    Apply
                  </Button>
                  <Button variant="outline" onClick={clearFilters} className="flex-1 h-11 shadow-sm">
                    Clear
                  </Button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedRows.size > 0 && (
                <>
                  <Separator />
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">
                      {selectedRows.size} booking{selectedRows.size !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 w-4 h-4" />
                        Export Selected
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Table Card */}
          <Card className="bg-white shadow-sm border-slate-200">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/50">
                    <TableHead className="w-14 py-4">
                      <Checkbox 
                        checked={selectedRows.size === bookings.data.length && bookings.data.length > 0} 
                        onCheckedChange={toggleAll}
                        className="border-slate-300"
                      />
                    </TableHead>
                    {['booking_reference','guest_full_name','package.title','package.owner.name','total_price','status','created_at'].map((col) => (
                      <TableHead 
                        key={col} 
                        className="cursor-pointer hover:bg-slate-100 transition-colors py-4 font-semibold text-slate-700" 
                        onClick={() => handleSort(col)}
                      >
                        <div className="flex items-center">
                          {getColumnIcon(col)}
                          {formatColumnHeader(col)}
                          <SortIcon column={col} />
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-20 py-4 text-center font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-slate-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-slate-900">No bookings found</p>
                            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : bookings.data.map((booking, index) => (
                    <TableRow 
                      key={booking.id} 
                      className={`
                        border-slate-200 hover:bg-slate-50/50 transition-colors
                        ${selectedRows.has(booking.id) ? 'bg-primary/5 border-primary/20' : ''}
                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}
                      `}
                    >
                      <TableCell className="py-4">
                        <Checkbox 
                          checked={selectedRows.has(booking.id)} 
                          onCheckedChange={() => toggleRow(booking.id)}
                          className="border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-medium text-slate-900">{booking.booking_reference}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {booking.user?.name || booking.guest_full_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="max-w-xs truncate" title={booking.package.title}>
                          <span className="font-medium text-slate-900">{booking.package.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-slate-700">{booking.package.owner.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-slate-500" />
                          {booking.total_price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 w-fit border`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-slate-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={route('bookings.show', booking.id)} className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => router.post(route('bookings.confirm', booking.id))}
                              className="flex items-center gap-2 text-emerald-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Confirm Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => router.post(route('bookings.cancel', booking.id))}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Showing <span className="font-medium">{bookings.data.length}</span> of{' '}
                  <span className="font-medium">{bookings.meta?.total || 0}</span> bookings
                </div>
                <div className="flex items-center space-x-2">
                  {bookings.links.map((link, idx) => (
                    <Link 
                      key={idx} 
                      href={link.url || '#'} 
                      className={`
                        px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                        ${link.active 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'hover:bg-slate-50 border-slate-300 text-slate-700'
                        }
                      `} 
                      dangerouslySetInnerHTML={{ __html: link.label }} 
                    />
                  ))}
                </div>
              </div>
          </Card>

          Enhanced Pagination
          <Card className="bg-white shadow-sm border-slate-200">
            <CardContent className="p-6">
              
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
