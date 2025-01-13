import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWager } from '../context/WagerContext';
import { CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';

const CreateWager = ({ onClose }) => {
  const { createWager, loading, error } = useWager();
  const [formData, setFormData] = useState({
    opponent: '',
    amount: '',
    gameHash: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWager(
        formData.opponent,
        parseFloat(formData.amount),
        formData.gameHash
      );
      onClose();
    } catch (error) {
      console.error('Error creating wager:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create New Wager
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="opponent"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Opponent Address
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="opponent"
              required
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0x..."
              value={formData.opponent}
              onChange={(e) =>
                setFormData({ ...formData, opponent: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Amount (ETH)
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              required
              step="0.001"
              min="0"
              className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="gameHash"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Game Hash
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="gameHash"
              required
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter game hash"
              value={formData.gameHash}
              onChange={(e) =>
                setFormData({ ...formData, gameHash: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Create Wager'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateWager;
