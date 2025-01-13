import api from './api';

const wagerService = {
  // Create a new wager
  createWager: async (opponent, amount, gameHash) => {
    try {
      const response = await api.post('/api/wagers', {
        opponent,
        amount,
        gameHash
      });
      return response.data;
    } catch (error) {
      console.error('Create wager error:', error);
      throw error.response?.data || error;
    }
  },

  // Accept a wager
  acceptWager: async (wagerId, amount) => {
    try {
      const response = await api.post(`/api/wagers/${wagerId}/accept`, { amount });
      return response.data;
    } catch (error) {
      console.error('Accept wager error:', error);
      throw error.response?.data || error;
    }
  },

  // Get wager details
  getWagerDetails: async (wagerId) => {
    try {
      const response = await api.get(`/api/wagers/${wagerId}`);
      return response.data;
    } catch (error) {
      console.error('Get wager details error:', error);
      throw error.response?.data || error;
    }
  },

  // Get active wagers
  getActiveWagers: async () => {
    try {
      console.log('Fetching active wagers...');
      const response = await api.get('/api/wagers/active');
      console.log('Active wagers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get active wagers error:', error);
      throw error.response?.data || error;
    }
  },

  // Get wager activity
  getWagerActivity: async () => {
    try {
      console.log('Fetching wager activity...');
      const response = await api.get('/api/wagers/activity');
      console.log('Wager activity response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get wager activity error:', error);
      throw error.response?.data || error;
    }
  },

  // Resolve a wager
  resolveWager: async (wagerId, winner) => {
    try {
      const response = await api.post(`/api/wagers/${wagerId}/resolve`, { winner });
      return response.data;
    } catch (error) {
      console.error('Resolve wager error:', error);
      throw error.response?.data || error;
    }
  },

  // Get all wagers (this will use the active wagers endpoint for now)
  getAllWagers: async () => {
    try {
      const response = await api.get('/api/wagers/active');
      return response.data;
    } catch (error) {
      console.error('Get all wagers error:', error);
      throw error.response?.data || error;
    }
  }
};

export default wagerService;
