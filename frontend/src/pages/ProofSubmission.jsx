import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { proofs } from '../services/api';

function ProofSubmission() {
  const [formData, setFormData] = useState({
    gameId: '',
    matchId: '',
    players: '',
    scores: '',
    gameSpecificData: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Format the data
      const proofData = {
        ...formData,
        players: formData.players.split(',').map(p => p.trim()),
        scores: formData.scores.split(',').map(s => Number(s.trim())),
        timestamp: new Date().toISOString(),
        gameSpecificData: formData.gameSpecificData ? JSON.parse(formData.gameSpecificData) : {}
      };

      const response = await proofs.submitProof(proofData);
      setSuccess('Proof submitted successfully! Hash: ' + response.proofHash);
      setFormData({
        gameId: '',
        matchId: '',
        players: '',
        scores: '',
        gameSpecificData: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit proof. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Submit Game Proof
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Submit proof of game results for verification
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="gameId" className="sr-only">Game ID</label>
              <input
                id="gameId"
                name="gameId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Game ID (e.g., fortnite)"
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="matchId" className="sr-only">Match ID</label>
              <input
                id="matchId"
                name="matchId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Match ID"
                value={formData.matchId}
                onChange={(e) => setFormData({ ...formData, matchId: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="players" className="sr-only">Players</label>
              <input
                id="players"
                name="players"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Players (comma-separated)"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="scores" className="sr-only">Scores</label>
              <input
                id="scores"
                name="scores"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Scores (comma-separated)"
                value={formData.scores}
                onChange={(e) => setFormData({ ...formData, scores: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="gameSpecificData" className="sr-only">Game Specific Data</label>
              <textarea
                id="gameSpecificData"
                name="gameSpecificData"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Game Specific Data (JSON format)"
                value={formData.gameSpecificData}
                onChange={(e) => setFormData({ ...formData, gameSpecificData: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Submit Proof'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default ProofSubmission;
