const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all activities
router.get('/', auth, async (req, res) => {
  try {
    // Mock activities data for now
    const activities = [
      {
        id: 1,
        type: 'wager_created',
        description: 'New wager created for Fortnite',
        amount: 0.1,
        timestamp: new Date(),
        status: 'pending'
      },
      {
        id: 2,
        type: 'wager_accepted',
        description: 'Wager accepted for Valorant',
        amount: 0.2,
        timestamp: new Date(),
        status: 'active'
      },
      {
        id: 3,
        type: 'wager_completed',
        description: 'Wager completed for League of Legends',
        amount: 0.15,
        timestamp: new Date(),
        status: 'completed'
      }
    ];
    
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

module.exports = router;
