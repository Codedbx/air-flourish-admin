import React, { useState } from 'react';
import { 
  Search,
  Bell,
  ChevronDown,
  User
} from 'lucide-react';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const notifications = [
    {
      id: 1,
      user: "John Doe",
      action: "just booked your...",
      time: "25 minutes ago",
      avatar: null
    },
    {
      id: 2,
      user: "John Doe", 
      action: "just booked your...",
      time: "45 minutes ago",
      avatar: null
    },
    {
      id: 3,
      user: "John Doe",
      action: "just booked your...",
      time: "59 minutes ago", 
      avatar: null
    }
  ];

  return (
    <div className="bg-white border-b w-full">
      {/* Main Header */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - User info and Navigation */}
        <div className="flex items-center space-x-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm">
            <button className="text-gray-500 hover:text-gray-700">
              Dashboards
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Default</span>
          </div>
        </div>

        {/* Right side - Search and Notifications */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{notification.user}</span>
                            {' '}
                            <span className="text-gray-600">{notification.action}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;