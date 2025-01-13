import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

function LiveGames() {
  const [socket, setSocket] = useState(null);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const { user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to game server');
    });

    socketInstance.on('player_joined', (data) => {
      setPlayers(prev => [...prev, data.playerId]);
    });

    socketInstance.on('game_update', (data) => {
      setGames(prev => prev.map(game => 
        game.id === data.gameId ? { ...game, ...data } : game
      ));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinGame = useCallback((gameId) => {
    if (socket) {
      socket.emit('join_game', gameId);
      setSelectedGame(gameId);
    }
  }, [socket]);

  const sendGameAction = useCallback((action) => {
    if (socket && selectedGame) {
      socket.emit('game_action', {
        gameId: selectedGame,
        playerId: socket.id,
        action
      });
    }
  }, [socket, selectedGame]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Live Games</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available Games List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Available Games</h2>
          <div className="space-y-4">
            {games.map(game => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{game.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Players: {game.players?.length || 0}</p>
                <button
                  onClick={() => joinGame(game.id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={selectedGame === game.id}
                >
                  {selectedGame === game.id ? 'Joined' : 'Join Game'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Game */}
        {selectedGame && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Active Game</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Game ID: {selectedGame}
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Live
                </span>
              </div>

              {/* Players List */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Connected Players</h4>
                <div className="grid grid-cols-2 gap-4">
                  {players.map(playerId => (
                    <div
                      key={playerId}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {playerId === socket?.id ? 'You' : `Player ${playerId.slice(0, 8)}...`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Actions */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Actions</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => sendGameAction('ready')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      setPlayers([]);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Leave Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LiveGames;
