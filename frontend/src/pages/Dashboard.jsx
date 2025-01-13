import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import web3Service from '../services/web3Service';
import StatsCard from '../components/StatsCard';
import ActivityCard from '../components/ActivityCard';
import WagerChart from '../components/WagerChart';
import MetaMaskGuide from '../components/MetaMaskGuide';
import Games from '../components/Games';
import SideNav from '../components/SideNav';
import Login from './Login';
import Register from './Register';
import { WagerProvider } from '../context/WagerContext';
import Wagers from '../components/Wagers';
import CreateWager from '../components/CreateWager';
import WagerActivity from '../components/WagerActivity';
import WagerActivityCard from '../components/WagerActivityCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Dashboard() {
  const { stats, activities, wagers } = useGame();
  const { isAuthenticated, user } = useAuth();
  const [showMetaMaskGuide, setShowMetaMaskGuide] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [showCreateWager, setShowCreateWager] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [account, setAccount] = useState(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  useEffect(() => {
    if (!web3Service.isMetaMaskInstalled()) {
      setShowMetaMaskGuide(true);
      return;
    }

    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletError('Please install MetaMask to connect your wallet');
      return;
    }

    setIsWalletConnecting(true);
    setWalletError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletError(error.message || 'Failed to connect wallet');
    } finally {
      setIsWalletConnecting(false);
    }
  };

  if (showMetaMaskGuide) {
    return <MetaMaskGuide />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left side - Welcome Message */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col justify-center lg:pr-8"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to Gaming Platform
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join our community of gamers and start wagering on your favorite games today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/api/login"
                  className="px-8 py-3 rounded-lg font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all duration-200 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/api/register"
                  className="px-8 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition-all duration-200 text-center"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Ensure we have default values if data is not yet loaded
  const safeStats = {
    totalWagers: stats?.totalWagers || '0',
    activeUsers: stats?.activeUsers || '0',
    successRate: stats?.successRate || '0%',
    avgTime: stats?.avgTime || '0m'
  };

  return (
    <WagerProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSideNavOpen(true)}
          className="fixed top-6 left-6 z-40 lg:hidden p-2.5 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg text-gray-600 hover:text-gray-900 hover:bg-white dark:bg-gray-800/80 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Side Navigation */}
        <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />

        {/* Wallet Connection Section */}
        {!account && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Connect Your Wallet</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Connect your wallet to start wagering</p>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={isWalletConnecting}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isWalletConnecting
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  } transition-colors duration-200`}
                >
                  {isWalletConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Error Alert */}
        {walletError && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{walletError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Account Info */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
                {account && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowCreateWager(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!account}
              >
                Create Wager
              </button>
            </div>

            {/* Stats Section */}
            <motion.section variants={itemVariants} className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Wagers"
                  value={safeStats.totalWagers}
                  icon={<CurrencyDollarIcon className="h-6 w-6" />}
                  className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                />
                <StatsCard
                  title="Active Users"
                  value={safeStats.activeUsers}
                  icon={<UserGroupIcon className="h-6 w-6" />}
                  className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white"
                />
                <StatsCard
                  title="Success Rate"
                  value={safeStats.successRate}
                  icon={<ChartBarIcon className="h-6 w-6" />}
                  className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                />
                <StatsCard
                  title="Average Time"
                  value={safeStats.avgTime}
                  icon={<ClockIcon className="h-6 w-6" />}
                  className="bg-gradient-to-br from-orange-500 to-pink-600 text-white"
                />
              </div>
            </motion.section>

            {/* Wagers List */}
            {account && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Wagers />
                <WagerActivity />
              </div>
            )}

            {/* Create Wager Modal */}
            {showCreateWager && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <CreateWager onClose={() => setShowCreateWager(false)} />
              </div>
            )}

            {/* Chart and Activity Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wager History</h2>
                  </div>
                  <div className="h-[300px]">
                    <WagerChart data={wagers} />
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  </div>
                  <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {activities.map((activity, index) => (
                      <ActivityCard key={index} activity={activity} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Games Section */}
            <motion.section variants={itemVariants} className="mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Games</h2>
                </div>
                <Games />
              </div>
            </motion.section>
          </div>
        </main>

        <WagerActivityCard />
      </div>
    </WagerProvider>
  );
}

export default Dashboard;