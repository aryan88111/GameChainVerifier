import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWager } from '../context/WagerContext';
import web3Service from '../services/web3Service';
import WagerActivity from '../components/WagerActivity';
import WagerActivityCard from './WagerActivityCard';


function WageringPlatform() {
  const { activeWagers, loading: wagerLoading, error: wagerError, fetchActiveWagers, acceptWager } = useWager();
  const [newWager, setNewWager] = useState({
    opponent: '',
    amount: '',
    gameHash: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveWagers();
  }, [fetchActiveWagers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWager(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateWager = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await web3Service.initialize();
      await wagerService.createWager(
        newWager.opponent,
        newWager.amount,
        newWager.gameHash
      );
      
      setNewWager({ opponent: '', amount: '', gameHash: '' });
      fetchActiveWagers();
    } catch (err) {
      setError(err.message || 'Failed to create wager');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptWager = async (wagerId, amount) => {
    try {
      await web3Service.initialize();
      await acceptWager(wagerId, amount);
    } catch (err) {
      setError('Failed to accept wager');
      console.error(err);
    }
  };

  return (
    <motion.div 
      className="wagering-platform p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-8">Wagering Platform</h1>
      <WagerActivityCard />
      {(error || wagerError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || wagerError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="active-wagers">
          <h2 className="text-2xl font-semibold mb-4">Active Wagers</h2>
          <div className="space-y-4">
            {wagerLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              activeWagers?.map((wager) => (
                <motion.div
                  key={wager.id}
                  className="bg-white p-4 rounded-lg shadow dark:bg-gray-800"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-gray-700 dark:text-gray-300">Opponent: {wager.opponent}</p>
                  <p className="text-gray-700 dark:text-gray-300">Amount: {wager.amount} ETH</p>
                  <p className="text-gray-700 dark:text-gray-300">Status: {wager.status}</p>
                  {wager.status === 'PENDING' && (
                    <button
                      onClick={() => handleAcceptWager(wager.id, wager.amount)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Accept Wager
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="create-wager">
          <h2 className="text-2xl font-semibold mb-4">Create New Wager</h2>
          <form onSubmit={handleCreateWager} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Opponent Address</label>
              <input
                type="text"
                name="opponent"
                value={newWager.opponent}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="0x..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amount (ETH)</label>
              <input
                type="number"
                name="amount"
                value={newWager.amount}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                step="0.001"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Game Hash</label>
              <input
                type="text"
                name="gameHash"
                value={newWager.gameHash}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Game identifier..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Wager'}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <WagerActivity />
      </div>
    </motion.div>
  );
}

export default WageringPlatform;
