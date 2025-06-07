// // resources/js/Pages/booking/Show.tsx
// import { Head, Link, router } from '@inertiajs/react'
// import AppLayout from '@/layouts/app-layout'
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { 
//   Calendar as CalendarIcon, 
//   User as UserIcon, 
//   Package as PackageIcon, 
//   List as ListIcon, 
//   CheckCircle as CheckCircleIcon, 
//   XCircle as XCircleIcon, 
//   CreditCard as CreditCardIcon,
//   Plane as PlaneIcon,
//   Hotel as HotelIcon,
//   Users as UsersIcon,
//   MapPin as MapPinIcon,
//   Receipt as ReceiptIcon,
//   Star as StarIcon
// } from 'lucide-react'

// interface ShowProps {
//   booking: {
//     id: number
//     booking_reference: string
//     user: { name: string } | null
//     guest_first_name: string
//     guest_last_name: string
//     guest_full_name: string
//     guest_email: string
//     guest_phone: string
//     guest_country: string
//     guest_city: string
//     guest_zip_code: string
//     guest_gender: string
//     pax_count: number
//     base_price: string
//     activities_total: string
//     computed_agent_addon: string
//     computed_admin_addon: string
//     total_price_per_person: string
//     total_price: string
//     status: string
//     created_at: string
//     updated_at: string
//     package: {
//       id: number
//       title: string
//       base_price: string
//       agent_addon_price: string
//       agent_price_type: string
//       booking_start_date: string
//       booking_end_date: string
//       is_active: boolean
//       is_featured: boolean
//       is_refundable: boolean
//       location: string
//       flight_from: string
//       flight_to: string
//       airline_name: string
//       booking_class: string
//       hotel_name: string
//       hotel_star_rating: number
//       hotel_checkin: string
//       hotel_checkout: string
//       owner?: { 
//         id: number
//         name: string 
//         email: string
//         business_name: string
//       }
//     }
//     payment?: {
//       id: number
//       amount: string
//       gateway: string
//       transaction_reference: string
//       status: string
//       created_at: string
//       meta?: {
//         return_url: string
//         cancel_url: string
//         original_amount: string
//         converted_amount: number
//         currency: string
//         checkout_url: string
//         gateway_reference: string
//       }
//     }
//     snapshot?: {
//       activities?: Array<{ 
//         activity_id: number
//         activity_title: string
//         activity_price: string
//         slot_id: number
//         slot_start: string
//         slot_end: string 
//       }>
//     }
//   }
// }

// export default function Show({ booking }: ShowProps) {
//   const {
//     id,
//     booking_reference,
//     user,
//     guest_first_name,
//     guest_last_name,
//     guest_full_name,
//     guest_email,
//     guest_phone,
//     guest_country,
//     guest_city,
//     guest_zip_code,
//     guest_gender,
//     pax_count,
//     base_price,
//     activities_total,
//     computed_agent_addon,
//     computed_admin_addon,
//     total_price_per_person,
//     total_price,
//     status,
//     created_at,
//     updated_at,
//     package: pkg,
//     payment,
//     snapshot,
//   } = booking

//   const confirm = () => router.post(route('bookings.confirm', id))
//   const cancel = () => router.post(route('bookings.cancel', id))

//   const statusColor = () => {
//     switch (status.toLowerCase()) {
//       case 'confirmed': return 'bg-green-100 text-green-800'
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'cancelled': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const paymentStatusColor = () => {
//     switch (payment?.status?.toLowerCase()) {
//       case 'completed': case 'success': return 'bg-green-100 text-green-800'
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'failed': case 'cancelled': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const formatCurrency = (amount: string | number) => {
//     return `$${parseFloat(amount.toString()).toFixed(2)}`
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const formatDateOnly = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     })
//   }

//   return (
//     <AppLayout>
//       <Head title={`Booking ${booking_reference}`} />
//       <div className="max-w-6xl mx-auto p-6 space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Booking {booking_reference}</h1>
//             <p className="text-gray-600 mt-1">Package: {pkg.title}</p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm" onClick={() => window.history.back()}>Back</Button>
//             {status === 'pending' && (
//               <Button size="sm" variant="outline" onClick={confirm}>
//                 <CheckCircleIcon className="mr-1 w-4 h-4" /> Confirm
//               </Button>
//             )}
//             {status !== 'cancelled' && (
//               <Button size="sm" variant="destructive" onClick={cancel}>
//                 <XCircleIcon className="mr-1 w-4 h-4" /> Cancel
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column */}
//           <div className="space-y-6">
//             {/* Basic Info */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><PackageIcon className="mr-2" />Booking Details</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Reference</p>
//                     <p className="font-mono">{booking_reference}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Status</p>
//                     <Badge className={`${statusColor()} px-2 py-1`}>{status.toUpperCase()}</Badge>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Created</p>
//                     <p>{formatDate(created_at)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Last Updated</p>
//                     <p>{formatDate(updated_at)}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Travelers</p>
//                     <p className="flex items-center"><UsersIcon className="w-4 h-4 mr-1" />{pax_count} {pax_count === 1 ? 'Person' : 'People'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Location</p>
//                     <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1" />{pkg.location}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Guest Information */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><UserIcon className="mr-2" />Guest Information</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Full Name</p>
//                     <p>{user?.name ?? guest_full_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Gender</p>
//                     <p className="capitalize">{guest_gender}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Email</p>
//                     <p className="text-sm">{guest_email}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Phone</p>
//                     <p>{guest_phone}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Country</p>
//                     <p>{guest_country}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">City</p>
//                     <p>{guest_city}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">ZIP Code</p>
//                     <p>{guest_zip_code}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Flight Details */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><PlaneIcon className="mr-2" />Flight Details</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">From</p>
//                     <p className="uppercase font-mono">{pkg.flight_from}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">To</p>
//                     <p className="uppercase font-mono">{pkg.flight_to}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Airline</p>
//                     <p className="capitalize">{pkg.airline_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Class</p>
//                     <p className="capitalize">{pkg.booking_class}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Hotel Details */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><HotelIcon className="mr-2" />Hotel Details</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Hotel Name</p>
//                   <div className="flex items-center">
//                     <p className="capitalize mr-2">{pkg.hotel_name}</p>
//                     <div className="flex">
//                       {[...Array(pkg.hotel_star_rating)].map((_, i) => (
//                         <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Check-in</p>
//                     <p>{formatDateOnly(pkg.hotel_checkin)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Check-out</p>
//                     <p>{formatDateOnly(pkg.hotel_checkout)}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             {/* Package Info */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><PackageIcon className="mr-2" />Package Information</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">Package Title</p>
//                   <p className="font-medium">{pkg.title}</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Travel Dates</p>
//                     <p className="text-sm">{formatDateOnly(pkg.booking_start_date)} - {formatDateOnly(pkg.booking_end_date)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Agent</p>
//                     <p>{pkg.owner?.name ?? '—'}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-4">
//                   {pkg.is_featured && <Badge variant="secondary">Featured</Badge>}
//                   {pkg.is_refundable && <Badge variant="outline">Refundable</Badge>}
//                   <Badge variant={pkg.is_active ? "default" : "destructive"}>
//                     {pkg.is_active ? 'Active' : 'Inactive'}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Pricing Breakdown */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><CreditCardIcon className="mr-2" />Pricing Breakdown</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Base Price (per person)</span>
//                     <span>{formatCurrency(base_price)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Activities Total</span>
//                     <span>{formatCurrency(activities_total)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Agent Add-on</span>
//                     <span>{formatCurrency(computed_agent_addon)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Admin Add-on</span>
//                     <span>{formatCurrency(computed_admin_addon)}</span>
//                   </div>
//                   <hr />
//                   <div className="flex justify-between font-medium">
//                     <span>Price per Person</span>
//                     <span>{formatCurrency(total_price_per_person)}</span>
//                   </div>
//                   <div className="flex justify-between font-medium">
//                     <span>Number of Travelers</span>
//                     <span>{pax_count}</span>
//                   </div>
//                   <hr />
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total Amount</span>
//                     <span>{formatCurrency(total_price)}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Payment Information */}
//             {payment && (
//               <Card>
//                 <CardHeader><CardTitle className="flex items-center"><ReceiptIcon className="mr-2" />Payment Information</CardTitle></CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Amount</p>
//                       <p className="font-medium">{formatCurrency(payment.amount)}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Status</p>
//                       <Badge className={`${paymentStatusColor()} px-2 py-1`}>{payment.status.toUpperCase()}</Badge>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Gateway</p>
//                       <p className="capitalize">{payment.gateway}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-500">Currency</p>
//                       <p>{payment.meta?.currency ?? 'USD'}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Transaction Reference</p>
//                     <p className="font-mono text-sm">{payment.transaction_reference}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-500">Payment Date</p>
//                     <p>{formatDate(payment.created_at)}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Activities */}
//             <Card>
//               <CardHeader><CardTitle className="flex items-center"><ListIcon className="mr-2" />Activities</CardTitle></CardHeader>
//               <CardContent>
//                 {snapshot?.activities?.length ? (
//                   <div className="space-y-3">
//                     {snapshot.activities.map((activity, i) => (
//                       <div key={i} className="border rounded-lg p-3">
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="font-medium">{activity.activity_title}</h4>
//                           <Badge variant="outline">{formatCurrency(activity.activity_price)}</Badge>
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           <p><CalendarIcon className="inline w-4 h-4 mr-1" />
//                             {formatDate(activity.slot_start)} - {formatDate(activity.slot_end)}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No activities selected for this booking.</p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   )
// }



// resources/js/Pages/booking/Show.tsx
import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  Package as PackageIcon, 
  List as ListIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon, 
  CreditCard as CreditCardIcon,
  Plane as PlaneIcon,
  Hotel as HotelIcon,
  Users as UsersIcon,
  MapPin as MapPinIcon,
  Receipt as ReceiptIcon,
  Star as StarIcon
} from 'lucide-react'
import { useState } from 'react'

interface ShowProps {
  booking: {
    id: number
    booking_reference: string
    user: { name: string } | null
    guest_first_name: string
    guest_last_name: string
    guest_full_name: string
    guest_email: string
    guest_phone: string
    guest_country: string
    guest_city: string
    guest_zip_code: string
    guest_gender: string
    pax_count: number
    base_price: string
    activities_total: string
    computed_agent_addon: string
    computed_admin_addon: string
    total_price_per_person: string
    total_price: string
    status: string
    created_at: string
    updated_at: string
    package: {
      id: number
      title: string
      base_price: string
      agent_addon_price: string
      agent_price_type: string
      booking_start_date: string
      booking_end_date: string
      is_active: boolean
      is_featured: boolean
      is_refundable: boolean
      location: string
      flight_from: string
      flight_to: string
      airline_name: string
      booking_class: string
      hotel_name: string
      hotel_star_rating: number
      hotel_checkin: string
      hotel_checkout: string
      owner?: { 
        id: number
        name: string 
        email: string
        business_name: string
      }
    }
    payment?: {
      id: number
      amount: string
      gateway: string
      transaction_reference: string
      status: string
      created_at: string
      meta?: {
        return_url: string
        cancel_url: string
        original_amount: string
        converted_amount: number
        currency: string
        checkout_url: string
        gateway_reference: string
      }
    }
    snapshot?: {
      activities?: Array<{ 
        activity_id: number
        activity_title: string
        activity_price: string
        slot_id: number
        slot_start: string
        slot_end: string 
      }>
    }
  }
}

export default function Show({ booking }: ShowProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  
  const {
    id,
    booking_reference,
    user,
    guest_first_name,
    guest_last_name,
    guest_full_name,
    guest_email,
    guest_phone,
    guest_country,
    guest_city,
    guest_zip_code,
    guest_gender,
    pax_count,
    base_price,
    activities_total,
    computed_agent_addon,
    computed_admin_addon,
    total_price_per_person,
    total_price,
    status,
    created_at,
    updated_at,
    package: pkg,
    payment,
    snapshot,
  } = booking

  const handleConfirm = () => {
    router.post(route('bookings.confirm', id))
    setShowConfirmDialog(false)
  }
  
  const handleCancel = () => {
    router.post(route('bookings.cancel', id))
    setShowCancelDialog(false)
  }

  const statusColor = () => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const paymentStatusColor = () => {
    switch (payment?.status?.toLowerCase()) {
      case 'completed': case 'success': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AppLayout>
      <Head title={`Booking ${booking_reference}`} />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Booking {booking_reference}</h1>
            <p className="text-gray-600 mt-1">Package: {pkg.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>Back</Button>
            {status === 'pending' && (
              <Button size="sm" variant="outline" onClick={() => setShowConfirmDialog(true)}>
                <CheckCircleIcon className="mr-1 w-4 h-4" /> Confirm
              </Button>
            )}
            {status !== 'cancelled' && (
              <Button size="sm" variant="destructive" onClick={() => setShowCancelDialog(true)}>
                <XCircleIcon className="mr-1 w-4 h-4" /> Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><PackageIcon className="mr-2" />Booking Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference</p>
                    <p className="font-mono">{booking_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge className={`${statusColor()} px-2 py-1`}>{status.toUpperCase()}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p>{formatDate(created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p>{formatDate(updated_at)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Travelers</p>
                    <p className="flex items-center"><UsersIcon className="w-4 h-4 mr-1" />{pax_count} {pax_count === 1 ? 'Person' : 'People'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1" />{pkg.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><UserIcon className="mr-2" />Guest Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p>{user?.name ?? guest_full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="capitalize">{guest_gender}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm">{guest_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{guest_phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p>{guest_country}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p>{guest_city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">ZIP Code</p>
                    <p>{guest_zip_code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Details */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><PlaneIcon className="mr-2" />Flight Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">From</p>
                    <p className="uppercase font-mono">{pkg.flight_from}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">To</p>
                    <p className="uppercase font-mono">{pkg.flight_to}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Airline</p>
                    <p className="capitalize">{pkg.airline_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Class</p>
                    <p className="capitalize">{pkg.booking_class}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotel Details */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><HotelIcon className="mr-2" />Hotel Details</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Hotel Name</p>
                  <div className="flex items-center">
                    <p className="capitalize mr-2">{pkg.hotel_name}</p>
                    <div className="flex">
                      {[...Array(pkg.hotel_star_rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in</p>
                    <p>{formatDateOnly(pkg.hotel_checkin)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-out</p>
                    <p>{formatDateOnly(pkg.hotel_checkout)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Package Info */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><PackageIcon className="mr-2" />Package Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Package Title</p>
                  <p className="font-medium">{pkg.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Travel Dates</p>
                    <p className="text-sm">{formatDateOnly(pkg.booking_start_date)} - {formatDateOnly(pkg.booking_end_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agent</p>
                    <p>{pkg.owner?.name ?? 'No Agent Assigned'}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  {pkg.is_featured && <Badge variant="secondary">Featured</Badge>}
                  {pkg.is_refundable && <Badge variant="outline">Refundable</Badge>}
                  <Badge variant={pkg.is_active ? "default" : "destructive"}>
                    {pkg.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Breakdown */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><CreditCardIcon className="mr-2" />Pricing Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price (per person)</span>
                    <span>{formatCurrency(base_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities Total</span>
                    <span>{formatCurrency(activities_total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agent Add-on</span>
                    <span>{formatCurrency(computed_agent_addon)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin Add-on</span>
                    <span>{formatCurrency(computed_admin_addon)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span>Price per Person</span>
                    <span>{formatCurrency(total_price_per_person)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Number of Travelers</span>
                    <span>{pax_count}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>{formatCurrency(total_price)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            {payment && (
              <Card>
                <CardHeader><CardTitle className="flex items-center"><ReceiptIcon className="mr-2" />Payment Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge className={`${paymentStatusColor()} px-2 py-1`}>{payment.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gateway</p>
                      <p className="capitalize">{payment.gateway}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Currency</p>
                      <p>{payment.meta?.currency ?? 'USD'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Reference</p>
                    <p className="font-mono text-sm">{payment.transaction_reference}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Date</p>
                    <p>{formatDate(payment.created_at)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activities */}
            <Card>
              <CardHeader><CardTitle className="flex items-center"><ListIcon className="mr-2" />Activities</CardTitle></CardHeader>
              <CardContent>
                {snapshot?.activities?.length ? (
                  <div className="space-y-3">
                    {snapshot.activities.map((activity, i) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{activity.activity_title}</h4>
                          <Badge variant="outline">{formatCurrency(activity.activity_price)}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><CalendarIcon className="inline w-4 h-4 mr-1" />
                            {formatDate(activity.slot_start)} - {formatDate(activity.slot_end)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No activities selected for this booking.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialogs */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to confirm booking <strong>{booking_reference}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="mr-1 w-4 h-4" />
                  Yes, Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel booking <strong>{booking_reference}</strong>? 
                This action cannot be undone and may affect the customer's travel plans.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Booking
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleCancel}
                >
                  <XCircleIcon className="mr-1 w-4 h-4" />
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}