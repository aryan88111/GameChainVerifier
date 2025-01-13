import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import GameIntegrationService from '../services/gameIntegrationService';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { selectGame } = useGame();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesData = await GameIntegrationService.fetchGames();
        setGames(gamesData);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameSelect = (game) => {
    selectGame(game);
    navigate(`/api/wagers/create?game=${game.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Supported Games</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-200 hover:scale-105"
              onClick={() => handleGameSelect(game)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">{game.name}</h2>
                    <p className="text-sm text-gray-500">{game.genre}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: {game.status}</span>
                  <span>Players: {game.playerCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
