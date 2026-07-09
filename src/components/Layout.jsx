import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  BellIcon,
  SearchIcon,
  LogoutIcon
} from '@heroicons/react/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">BOSS App</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <XIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="mt-4 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label={`Navigate to ${item.name}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 mr-3" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Logout from application"
          >
            <LogoutIcon className="w-5 h-5 mr-3" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
              aria-label="Open sidebar menu"
            >
              <MenuIcon className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center flex-1 px-4 lg:px-0">
              <div className="relative w-full max-w-md">
                <button
                  className="absolute inset-y-0 left-0 flex items-center pl-3"
                  aria-label="Search"
                >
                  <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search input"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                aria-label="View notifications"
              >
                <BellIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Open user profile menu"
              >
                <UserIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
