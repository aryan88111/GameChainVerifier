const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GameIntegrationService = require('../services/gameIntegrationService');

// Get all supported games
router.get('/', auth, async (req, res) => {
  try {
    const games = [
      {
        id: 'fortnite',
        name: 'Fortnite',
        description: 'Battle Royale game by Epic Games',
        icon: '/images/fortnite.png',
        status: 'active',
        playerCount: '350M+'
      },
      {
        id: 'valorant',
        name: 'Valorant',
        description: 'Tactical shooter with unique agent abilities',
        icon: '/images/valorant.png',
        status: 'active',
        playerCount: '15M+'
      },
      {
        id: 'league',
        name: 'League of Legends',
        description: 'Strategic MOBA with diverse champions',
        icon: '/images/lol.png',
        status: 'active',
        playerCount: '180M+'
      }
    ];
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get game stats
router.get('/:gameId/stats', auth, async (req, res) => {
  try {
    const { gameId } = req.params;
    const stats = await GameIntegrationService.getGameStats(gameId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching game stats:', error);
    res.status(500).json({ message: 'Error fetching game stats' });
  }
});

// Verify game results
router.post('/verify', auth, async (req, res) => {
  try {
    const { gameId, matchId, playerStats } = req.body;
    const result = await GameIntegrationService.verifyGameResults(gameId, matchId, playerStats);
    res.json(result);
  } catch (error) {
    console.error('Error verifying game results:', error);
    res.status(500).json({ message: 'Error verifying game results' });
  }
});

module.exports = router;
