import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserIcon,
  UserPlusIcon,
  PuzzlePieceIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const SideNav = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = isAuthenticated ? [
    { path: '/api/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/api/games', name: 'Games', icon: PuzzlePieceIcon },
    { path: '/api/wagers', name: 'Create Wager', icon: CurrencyDollarIcon },
    { path: '/api/profile', name: 'Profile', icon: UserIcon },
    { path: '/api/submit-proof', name: 'Submit Proof', icon: DocumentTextIcon },
  ] : [
    { path: '/api/login', name: 'Login', icon: ArrowLeftOnRectangleIcon },
    { path: '/api/register', name: 'Register', icon: UserPlusIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-30 transform 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                GameWager
              </h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden"
              >
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </div>
            
            {/* User Info */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                {isAuthenticated ? (
                  <div>
                    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.username}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                ) : (
                  <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Welcome, Guest
                  </h2>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-150"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SideNav;
