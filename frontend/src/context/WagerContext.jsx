import React, { createContext, useContext, useState, useCallback } from 'react';
import wagerService from '../services/wagerService';

const WagerContext = createContext();

export const useWager = () => {
  const context = useContext(WagerContext);
  if (!context) {
    throw new Error('useWager must be used within a WagerProvider');
  }
  return context;
};

export const WagerProvider = ({ children }) => {
  const [activeWagers, setActiveWagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new wager
  const createWager = useCallback(async (opponent, amount, gameHash) => {
    setLoading(true);
    setError(null);
    try {
      const result = await wagerService.createWager(opponent, amount, gameHash);
      await fetchActiveWagers(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err.details ? `${err.message}: ${err.details}` : err.message;
      setError(errorMessage || 'Error creating wager');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept a wager
  const acceptWager = useCallback(async (wagerId, amount) => {
    setLoading(true);
    setError(null);
    try {
      const result = await wagerService.acceptWager(wagerId, amount);
      await fetchActiveWagers(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err.details ? `${err.message}: ${err.details}` : err.message;
      setError(errorMessage || 'Error accepting wager');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch active wagers
  const fetchActiveWagers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wagers = await wagerService.getActiveWagers();
      setActiveWagers(wagers);
      return wagers;
    } catch (err) {
      const errorMessage = err.details ? `${err.message}: ${err.details}` : err.message;
      setError(errorMessage || 'Error fetching wagers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get wager details
  const getWagerDetails = useCallback(async (wagerId) => {
    setLoading(true);
    setError(null);
    try {
      return await wagerService.getWagerDetails(wagerId);
    } catch (err) {
      const errorMessage = err.details ? `${err.message}: ${err.details}` : err.message;
      setError(errorMessage || 'Error fetching wager details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Resolve a wager
  const resolveWager = useCallback(async (wagerId, winner) => {
    setLoading(true);
    setError(null);
    try {
      const result = await wagerService.resolveWager(wagerId, winner);
      await fetchActiveWagers(); // Refresh the list
      return result;
    } catch (err) {
      const errorMessage = err.details ? `${err.message}: ${err.details}` : err.message;
      setError(errorMessage || 'Error resolving wager');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    activeWagers,
    loading,
    error,
    createWager,
    acceptWager,
    getWagerDetails,
    fetchActiveWagers,
    resolveWager
  };

  return (
    <WagerContext.Provider value={value}>
      {children}
    </WagerContext.Provider>
  );
};

export default WagerContext;
