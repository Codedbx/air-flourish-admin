// "use client"

// import { useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Button } from "@/components/ui/button"
// import { Bell, User, Calendar, FileText, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react"

// const NotificationsPanel = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false)

//   const notifications = [
//     {
//       id: 1,
//       message: "John Doe just booked your...",
//       time: "23 minutes ago",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     {
//       id: 2,
//       message: "John Doe just booked your...",
//       time: "45 minutes ago",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//     {
//       id: 3,
//       message: "John Doe just booked your...",
//       time: "1 hour ago",
//       avatar: "/placeholder.svg?height=32&width=32",
//     },
//   ]

//   const activities = [
//     {
//       id: 1,
//       action: "Changed the style.",
//       time: "just now",
//       icon: Edit,
//       color: "bg-purple-500",
//     },
//     {
//       id: 2,
//       action: "Booked a new package",
//       time: "5X minutes ago",
//       icon: Calendar,
//       color: "bg-green-500",
//     },
//     {
//       id: 3,
//       action: "Submitted a modification",
//       time: "12 hours ago",
//       icon: FileText,
//       color: "bg-orange-500",
//     },
//     {
//       id: 4,
//       action: "Modified A data in Page X.",
//       time: "Today, 11:29 AM",
//       icon: Edit,
//       color: "bg-amber-600",
//     },
//     {
//       id: 5,
//       action: "Deleted a trip X.",
//       time: "Dec 2, 2024",
//       icon: Trash2,
//       color: "bg-blue-500",
//     },
//   ]

//   const trafficData = [
//     { platform: "Google", value: 85 },
//     { platform: "YouTube", value: 70 },
//     { platform: "Instagram", value: 60 },
//     { platform: "Pinterest", value: 45 },
//     { platform: "Facebook", value: 40 },
//     { platform: "Twitter", value: 30 },
//     { platform: "Tumblr", value: 25 },
//   ]

//   return (
//     <div
//       className={`border-l border-b bg-background overflow-y-auto transition-all duration-300 ease-in-out ${
//         isCollapsed ? "w-12" : "w-80"
//       }`}
//     >
//       {/* Toggle Button */}
//       <div className="p-2 border-b">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="w-full flex items-center justify-center"
//         >
//           {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
//         </Button>
//       </div>

//       {/* Collapsed State - Show only icons */}
//       {isCollapsed && (
//         <div className="p-2 space-y-4">
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <Bell className="h-5 w-5 text-muted-foreground" />
//               <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
//             </div>
//             <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
//               <Edit className="h-3 w-3 text-white" />
//             </div>
//             <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//               <Calendar className="h-3 w-3 text-white" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Expanded State - Show full content */}
//       {!isCollapsed && (
//         <>
//           {/* Notifications Section */}
//           <div className="text-card-foreground">
//             <div className="flex flex-col space-y-1.5 p-6">
//               <div className="text-sm font-medium flex items-center gap-2">
//                 <Bell className="h-4 w-4" />
//                 Notifications
//                 <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                   {notifications.length}
//                 </span>
//               </div>
//             </div>
//             <div className="p-6 pt-0 space-y-4">
//               {notifications.map((notification) => (
//                 <div key={notification.id} className="flex items-start gap-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={notification.avatar || "/placeholder.svg"} />
//                     <AvatarFallback>
//                       <User className="h-4 w-4" />
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 space-y-1">
//                     <p className="text-sm text-foreground">{notification.message}</p>
//                     <p className="text-xs text-muted-foreground">{notification.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Activities Section */}
//           <div className="text-card-foreground">
//             <div className="flex flex-col space-y-1.5 p-6 pb-3">
//               <div className="text-sm font-medium">Activities</div>
//             </div>
//             <div className="p-6 pt-0 space-y-4">
//               {activities.map((activity) => (
//                 <div key={activity.id} className="flex items-start gap-3">
//                   <div className={`p-1.5 rounded-full ${activity.color}`}>
//                     <activity.icon className="h-3 w-3 text-white" />
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <p className="text-sm text-foreground">{activity.action}</p>
//                     <p className="text-xs text-muted-foreground">{activity.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Traffic by Website Section */}
//           <div className="text-card-foreground">
//             <div className="flex flex-col space-y-1.5 p-6 pb-3">
//               <div className="text-sm font-medium">Traffic by Website</div>
//             </div>
//             <div className="p-6 pt-0 space-y-4">
//               {trafficData.map((item) => (
//                 <div key={item.platform} className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-foreground">{item.platform}</span>
//                     <span className="text-muted-foreground">{item.value}%</span>
//                   </div>
//                   <Progress value={item.value} className="h-2" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default NotificationsPanel


// resources/js/components/dashboard/NotificationsPanel.jsx
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Bell,
  User,
  Calendar,
  FileText,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock,
} from 'lucide-react';

//
// Props:
//   • payments: Array<{
//       id: number,
//       amount_formatted: string,       // e.g. "123.45"
//       gateway: string,                // e.g. "stripe"
//       status: string,                 // e.g. "success", "failed"
//       booking_reference: string,      // e.g. "ABCD1234"
//       created_at_human: string        // e.g. "3 minutes ago"
//     }]
//

const NotificationsPanel = ({ payments }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dummy notifications (unchanged)
  const notifications = [
    {
      id: 1,
      message: 'John Doe just booked your...',
      time: '23 minutes ago',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 2,
      message: 'John Doe just booked your...',
      time: '45 minutes ago',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 3,
      message: 'John Doe just booked your...',
      time: '1 hour ago',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  ];

  // Dummy “Traffic by Website” data (unchanged)
  const trafficData = [
    { platform: 'Google', value: 85 },
    { platform: 'YouTube', value: 70 },
    { platform: 'Instagram', value: 60 },
    { platform: 'Pinterest', value: 45 },
    { platform: 'Facebook', value: 40 },
    { platform: 'Twitter', value: 30 },
    { platform: 'Tumblr', value: 25 },
  ];

  return (
    <div
      className={`border-l border-b bg-background overflow-y-auto transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}
    >
      {/* Toggle Button */}
      <div className="p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center"
        >
          {isCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Collapsed State - Show only icons */}
      {isCollapsed && (
        <div className="p-2 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Edit className="h-3 w-3 text-white" />
            </div>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="h-3 w-3 text-white" />
            </div>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CreditCard className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded State - Full Content */}
      {!isCollapsed && (
        <>
          {/* ── Notifications Section ────────────────────────────────────────────── */}
          <div className="text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={notification.avatar || '/placeholder.svg'}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Payments Section (replacing Activities) ───────────────────────────── */}
          {payments && payments.length > 0 && (
            <div className="text-card-foreground">
              <div className="flex items-center gap-2 p-6 border-t">
                <CreditCard className="h-4 w-4" />
                <h3 className="text-sm font-medium">Payments</h3>
              </div>
              <div className="p-6 pt-0 space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        // Attempt to load a gateway icon; if missing, fallback to placeholder
                        src={`/icons/${p.gateway}.svg`}
                        alt={p.gateway}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <AvatarFallback>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">${p.amount_formatted}</span> via{' '}
                        <span className="capitalize">{p.gateway}</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.created_at_human}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Booking Ref: <span className="font-medium">{p.booking_reference}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Traffic by Website Section ─────────────────────────────────────────── */}
          <div className="text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6 pb-3">
              <div className="text-sm font-medium">Traffic by Website</div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {trafficData.map((item) => (
                <div key={item.platform} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.platform}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
