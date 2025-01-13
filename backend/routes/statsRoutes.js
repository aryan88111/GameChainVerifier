const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user stats
router.get('/', auth, async (req, res) => {
  try {
    // Mock stats data for now
    const stats = {
      totalWagers: 10,
      totalWins: 7,
      totalLosses: 3,
      winRate: '70%',
      totalEarnings: 1.5,
      activeWagers: 2,
      completedWagers: 8,
      recentGames: [
        { game: 'Fortnite', result: 'win', date: new Date() },
        { game: 'Valorant', result: 'loss', date: new Date() },
        { game: 'League of Legends', result: 'win', date: new Date() }
      ]
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
