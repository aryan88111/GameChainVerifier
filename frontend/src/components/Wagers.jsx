import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWager } from '../context/WagerContext';
import {
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Wagers = () => {
  const {
    activeWagers,
    loading,
    error,
    fetchActiveWagers,
    acceptWager,
    resolveWager
  } = useWager();
  const [selectedWager, setSelectedWager] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const loadWagers = async () => {
      try {
        await fetchActiveWagers();
      } catch (err) {
        console.error('Error loading wagers:', err);
      }
    };
    loadWagers();
  }, [fetchActiveWagers]);

  const handleAcceptWager = async (wagerId, amount) => {
    setActionError(null);
    try {
      await acceptWager(wagerId, amount);
      await fetchActiveWagers(); // Refresh the list
    } catch (error) {
      setActionError(error.message || 'Error accepting wager');
      console.error('Error accepting wager:', error);
    }
  };

  const handleResolveWager = async (wagerId, winner) => {
    setActionError(null);
    try {
      await resolveWager(wagerId, winner);
      await fetchActiveWagers(); // Refresh the list
    } catch (error) {
      setActionError(error.message || 'Error resolving wager');
      console.error('Error resolving wager:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchActiveWagers}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!activeWagers || activeWagers.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Active Wagers</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new wager.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-600">{actionError}</p>
        </div>
      )}

      {activeWagers.map((wager) => (
        <motion.div
          key={wager.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Wager #{wager.id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount: {wager.amount} ETH
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {wager.accepted ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Accepted
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Creator: {wager.creator.slice(0, 6)}...{wager.creator.slice(-4)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Opponent: {wager.opponent ? `${wager.opponent.slice(0, 6)}...${wager.opponent.slice(-4)}` : 'Not Set'}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {!wager.accepted && (
                <button
                  onClick={() => handleAcceptWager(wager.id, wager.amount)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Accept Wager
                </button>
              )}
              {wager.accepted && !wager.resolved && (
                <>
                  <button
                    onClick={() => handleResolveWager(wager.id, wager.creator)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Creator Won
                  </button>
                  <button
                    onClick={() => handleResolveWager(wager.id, wager.opponent)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Opponent Won
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Wagers;
