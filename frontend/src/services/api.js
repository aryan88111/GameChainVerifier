import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/api/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error - please check your connection' });
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Auth API
export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error.response?.data || error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register API error:', error.response?.data || error);
      throw error;
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error.response?.data || error);
      throw error;
    }
  }
};

// Games API
export const games = {
  getAllGames: async () => {
    try {
      const response = await api.get('/api/game/');

      return response.data;
    } catch (error) {
      console.error('Get all games API error:', error.response?.data || error);
      throw error;
    }
  },
  getGameById: async (gameId) => {
    try {
      const response = await api.get(`/api/game/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Get game by ID API error:', error.response?.data || error);
      throw error;
    }
  },
  createGame: async (gameData) => {
    try {
      const response = await api.post('/api/game/create', gameData);
      return response.data;
    } catch (error) {
      console.error('Create game API error:', error.response?.data || error);
      throw error;
    }
  },
  joinGame: async (gameId, playerData) => {
    try {
      const response = await api.post(`/api/game/${gameId}/join`, playerData);
      return response.data;
    } catch (error) {
      console.error('Join game API error:', error.response?.data || error);
      throw error;
    }
  },
  updateGameStatus: async (gameId, statusData) => {
    try {
      const response = await api.put(`/api/game/${gameId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Update game status API error:', error.response?.data || error);
      throw error;
    }
  },
  getGameStats: async (gameId) => {
    try {
      const response = await api.get(`/api/game/${gameId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get game stats API error:', error.response?.data || error);
      throw error;
    }
  }
};

// Wagers API
export const wagers = {
  createWager: async (wagerData) => {
    try {
      const response = await api.post('/api/wager', wagerData);
      return response.data;
    } catch (error) {
      console.error('Create wager API error:', error.response?.data || error);
      throw error;
    }
  },
  getWagers: async () => {
    try {
      const response = await api.get('/api/wager');
      return response.data;
    } catch (error) {
      console.error('Get wagers API error:', error.response?.data || error);
      throw error;
    }
  },
  getWagerById: async (wagerId) => {
    try {
      const response = await api.get(`/api/wager/${wagerId}`);
      return response.data;
    } catch (error) {
      console.error('Get wager by ID API error:', error.response?.data || error);
      throw error;
    }
  },
  acceptWager: async (wagerId) => {
    try {
      const response = await api.post(`/api/wager/${wagerId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Accept wager API error:', error.response?.data || error);
      throw error;
    }
  },
  resolveWager: async (wagerId, resolutionData) => {
    try {
      const response = await api.post(`/api/wager/${wagerId}/resolve`, resolutionData);
      return response.data;
    } catch (error) {
      console.error('Resolve wager API error:', error.response?.data || error);
      throw error;
    }
  }
};

// Proofs API
export const proofs = {
  submitProof: async (proofData) => {
    try {
      const response = await api.post('/api/proof/submit', proofData);
      return response.data;
    } catch (error) {
      console.error('Submit proof API error:', error.response?.data || error);
      throw error;
    }
  },
  getProofs: async () => {
    try {
      const response = await api.get('/api/proof/list');
      return response.data;
    } catch (error) {
      console.error('Get proofs API error:', error.response?.data || error);
      throw error;
    }
  },
  verifyProof: async (proofId) => {
    try {
      const response = await api.post(`/api/proof/${proofId}/verify`);
      return response.data;
    } catch (error) {
      console.error('Verify proof API error:', error.response?.data || error);
      throw error;
    }
  }
};

// Stats API
export const stats = {
  getUserStats: async () => {
    try {
      const response = await api.get('/api/game/stats/user');
      return response.data;
    } catch (error) {
      console.error('Get user stats API error:', error.response?.data || error);
      throw error;
    }
  },
  getGameActivity: async () => {
    try {
      const response = await api.get('/api/game/activity');
      return response.data;
    } catch (error) {
      console.error('Get game activity API error:', error.response?.data || error);
      throw error;
    }
  }
};

export default api;
