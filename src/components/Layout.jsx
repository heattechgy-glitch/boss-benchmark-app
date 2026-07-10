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
  LogoutIcon,
  ChevronRightIcon
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

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const navItem = navigation.find((item) => item.href === currentPath);
      const name = navItem ? navItem.name : segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, href: currentPath });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

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

        {/* Breadcrumb Navigation */}
        <nav className="px-4 py-3 border-b bg-gray-50" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" aria-hidden="true" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-700 font-medium" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

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
        {/* Top header */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <MenuIcon className="w-6 h-6 text-gray-600" />
          </button>

          <div className="flex items-center flex-1 px-4 lg:px-0">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="View notifications"
            >
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
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