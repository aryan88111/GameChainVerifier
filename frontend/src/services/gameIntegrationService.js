import api from './api';

class GameIntegrationService {
  async fetchFortniteStats(playerId) {
    try {
      const response = await api.get(`/api/games/fortnite/${playerId}/stats`);
      return this.transformStats(response.data);
    } catch (error) {
      console.error('Error fetching Fortnite stats:', error);
      throw error;
    }
  }

  transformStats(rawData) {
    return {
      kills: rawData.stats?.kills || 0,
      wins: rawData.stats?.wins || 0,
      matchesPlayed: rawData.stats?.matchesPlayed || 0,
      winRate: rawData.stats?.winRate || 0
    };
  }

  async fetchGames() {
    try {
      const response = await api.get('/api/games');
      return response.data;
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async verifyGameResults(gameId, matchId, playerStats) {
    try {
      const response = await api.post('/api/games/verify', {
        gameId,
        matchId,
        playerStats
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying game results:', error);
      throw error;
    }
  }

  async fetchTournaments(gameId) {
    try {
      const response = await api.get(`/api/games/${gameId}/tournaments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      throw error;
    }
  }
}

export default new GameIntegrationService();
