import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = userData?.role === 'ADMIN';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!currentUser) return null;

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/entries/new', label: 'New Entry' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel' }] : [])
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/dashboard" 
              className="text-xl sm:text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md px-2 py-1"
              aria-label="Artist Book - Go to dashboard"
              onClick={closeMobileMenu}
            >
              Artist Book
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            <ul className="flex items-center space-x-6">
              {navigationItems.map(item => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md px-3 py-2 ${
                      location.pathname === item.path 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600 truncate max-w-32" title={userData?.name || currentUser.email}>
              {userData?.name || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-label="Sign out of your account"
            >
              Sign Out
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition duration-150 ease-in-out"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          
          {/* User info in mobile */}
          <div className="px-3 py-3 border-b border-gray-100 mb-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {userData?.name || currentUser.email}
                </div>
                <div className="text-xs text-gray-500">
                  {isAdmin ? 'Administrator' : 'User'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile navigation links */}
          <nav role="navigation" aria-label="Mobile navigation">
            {navigationItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-3 text-base font-medium transition duration-150 ease-in-out rounded-md ${
                  location.pathname === item.path
                    ? 'text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
                onClick={closeMobileMenu}
              >
                <div className="flex items-center">
                  {/* Dashboard icon */}
                  {item.path === '/dashboard' && (
                    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                    </svg>
                  )}
                  {/* New Entry icon */}
                  {item.path === '/entries/new' && (
                    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  {/* Admin icon */}
                  {item.path === '/admin' && (
                    <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {item.label}
                </div>
              </Link>
            ))}
            
            {/* Mobile logout button */}
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full text-left block px-3 py-3 text-base font-medium text-red-700 hover:text-red-800 hover:bg-red-50 transition duration-150 ease-in-out rounded-md"
            >
              <div className="flex items-center">
                <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </div>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}