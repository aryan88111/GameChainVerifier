import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import GameIntegrationService from '../services/gameIntegrationService';
import wagerService from '../services/wagerService';
import api from '../services/api';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Only fetch data if user is authenticated
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await api.get('/api/activities');
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: isAuthenticated ? 30000 : false
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      if (!isAuthenticated) return {};
      const response = await api.get('/api/stats');
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: isAuthenticated ? 30000 : false
  });

  const { data: wagers = [], isLoading: wagersLoading } = useQuery({
    queryKey: ['wagers'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await wagerService.getAllWagers();
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: isAuthenticated ? 30000 : false,
    onError: (error) => {
      console.error('Error fetching wagers:', error);
      return []; // Return empty array on error
    }
  });

  const fetchGameStats = useCallback(async (gameId, playerId) => {
    if (!isAuthenticated) return null;
    setLoading(true);
    setError(null);
    try {
      const stats = await GameIntegrationService.fetchFortniteStats(playerId);
      setGameStats(stats);
      return stats;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch game stats';
      setError(errorMessage);
      console.error('Error fetching game stats:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const verifyGameResults = useCallback(async (gameId, matchId, playerStats) => {
    if (!isAuthenticated) return null;
    setLoading(true);
    setError(null);
    try {
      const result = await GameIntegrationService.verifyGameResults(gameId, matchId, playerStats);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify game results';
      setError(errorMessage);
      console.error('Error verifying game results:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const selectGame = useCallback((game) => {
    setSelectedGame(game);
    setGameStats(null); // Reset stats when changing games
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    selectedGame,
    gameStats,
    loading: loading || (isAuthenticated && (activitiesLoading || statsLoading || wagersLoading)),
    error,
    activities: activities || [],
    stats: stats || {},
    wagers: wagers || [],
    selectGame,
    fetchGameStats,
    verifyGameResults,
    clearError
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameProvider;
