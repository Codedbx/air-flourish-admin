"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Plus,
  LayoutDashboard,
  Calendar,
  FileText,
  Package,
  Users,
  ChevronRight,
  Clock,
  Shield,
  UserPlus,
} from "lucide-react"

const AppSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openItems, setOpenItems] = useState({
    bookings: true,
    invoices: false,
    packages: false,
    activities: false,
    users: false,
  })

  const handleNavigation = (route) => {
    if (route) {
      navigate(route)
    }
  }

  const isRouteActive = (route) => {
    return location.pathname === route || (route === "/admin" && location.pathname === "/admin/")
  }

  const isParentActive = (routes) => {
    return routes.some((route) => location.pathname === route || location.pathname.startsWith(route))
  }

  const toggleCollapsible = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const quickActions = [
    {
      title: "New Booking",
      icon: Plus,
      route: "/admin/bookings",
    },
    {
      title: "Create Package",
      icon: Plus,
      route: "/admin/package-builder",
    },
    {
      title: "Create User",
      icon: UserPlus,
      route: "/admin/create-user",
    },
  ]

  const dashboardItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      route: "/admin",
    },
    {
      title: "Bookings",
      icon: Calendar,
      key: "bookings",
      items: [
        { title: "All Bookings", route: "/admin/bookings" },
        { title: "Pending", route: "/admin/bookings?status=pending" },
        { title: "Confirmed", route: "/admin/bookings?status=confirmed" },
        { title: "Cancelled", route: "/admin/bookings?status=cancelled" },
      ],
    },
    {
      title: "Invoices",
      icon: FileText,
      key: "invoices",
      items: [
        { title: "All Invoices", route: "/admin/invoices" },
        { title: "Paid", route: "/admin/invoices?status=paid" },
        { title: "Pending", route: "/admin/invoices?status=pending" },
        { title: "Overdue", route: "/admin/invoices?status=overdue" },
      ],
    },
    {
      title: "Travel Package",
      icon: Package,
      key: "packages",
      items: [
        { title: "All Packages", route: "/admin/packages" },
        { title: "Create Packages", route: "/admin/package-builder" },
      ],
    },
    {
      title: "Activities",
      icon: Clock,
      key: "activities",
      items: [
        { title: "All Activities", route: "/admin/activities" },
        { title: "Create Activities", route: "/admin/create-activities" },
      ],
    },
    {
      title: "User Access",
      icon: Users,
      key: "users",
      items: [
        { title: "All Users", route: "/admin/user-access" },
        { title: "Create User", route: "/admin/create-user" },
        { title: "Admins", route: "/admin/user-access?role=admin" },
        { title: "Agents", route: "/admin/user-access?role=agent" },
        { title: "Customers", route: "/admin/user-access?role=customer" },
      ],
    },
    {
      title: "Role Management",
      icon: Shield,
      route: "/admin/role-management",
    },
  ]

  return (
    <div className="w-64 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img src="/icons/bye-wind.svg" className="h-6 w-6" alt="bye-wind" />
          <span className="text-lg font-semibold text-gray-900">ByeWind</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Actions */}
        <div className="px-4 py-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">Quick Actions</div>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => handleNavigation(action.route)}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <action.icon className="h-4 w-4 mr-3 text-gray-500" />
                {action.title}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboards */}
        <div className="px-4 py-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">Dashboards</div>
          <div className="space-y-1">
            {dashboardItems.map((item) => {
              const Icon = item.icon

              if (item.items) {
                // Collapsible menu item
                const parentRoutes = item.items.map((subItem) => subItem.route).filter(Boolean)
                const isActive = isParentActive(parentRoutes)
                const isOpen = openItems[item.key]

                return (
                  <div key={item.title}>
                    <button
                      onClick={() => toggleCollapsible(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-4 w-4 mr-3 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                        {item.title}
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        } ${isActive ? "text-blue-700" : "text-gray-400"}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-1 ml-6 space-y-1">
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={() => handleNavigation(subItem.route)}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              subItem.route && isRouteActive(subItem.route)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full mr-3 ${
                                subItem.route && isRouteActive(subItem.route) ? "bg-blue-700" : "bg-gray-400"
                              }`}
                            />
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              } else {
                // Simple menu item
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.route)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.route && isRouteActive(item.route)
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 mr-3 ${
                        item.route && isRouteActive(item.route) ? "text-blue-700" : "text-gray-500"
                      }`}
                    />
                    {item.title}
                  </button>
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppSidebar
