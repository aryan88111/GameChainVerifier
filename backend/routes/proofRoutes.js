const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Generate a proof hash for a game result
function generateProofHash(gameData) {
    const dataString = JSON.stringify(gameData);
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

// Submit a new game proof
router.post('/', auth, async (req, res) => {
    try {
        const {
            gameId,
            matchId,
            timestamp,
            players,
            scores,
            gameSpecificData
        } = req.body;

        // Validate required fields
        if (!gameId || !matchId || !players || !scores) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }

        // Create proof data object
        const proofData = {
            gameId,
            matchId,
            timestamp: timestamp || new Date().toISOString(),
            players,
            scores,
            gameSpecificData,
            submittedBy: req.user.id
        };

        // Generate proof hash
        const proofHash = generateProofHash(proofData);

        // In a real implementation, you would:
        // 1. Store the proof in your database
        // 2. Submit the proof hash to the blockchain
        // 3. Notify other players for verification

        res.json({
            success: true,
            proofHash,
            message: 'Proof submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting proof:', error);
        res.status(500).json({ message: 'Error submitting game proof' });
    }
});

// Verify a game proof
router.post('/verify', auth, async (req, res) => {
    try {
        const { proofHash, gameData } = req.body;

        if (!proofHash || !gameData) {
            return res.status(400).json({ 
                message: 'Missing proof hash or game data' 
            });
        }

        // Generate hash from provided game data
        const calculatedHash = generateProofHash(gameData);

        // Compare hashes
        const isValid = proofHash === calculatedHash;

        res.json({
            valid: isValid,
            message: isValid ? 'Proof verified successfully' : 'Invalid proof'
        });
    } catch (error) {
        console.error('Error verifying proof:', error);
        res.status(500).json({ message: 'Error verifying game proof' });
    }
});

// Get proof history for a match
router.get('/match/:matchId', auth, async (req, res) => {
    try {
        const { matchId } = req.params;

        // In a real implementation, you would:
        // 1. Query your database for all proofs related to this match
        // 2. Return the proof history

        // Placeholder response
        res.json({
            matchId,
            proofs: [],
            message: 'Proof history feature coming soon'
        });
    } catch (error) {
        console.error('Error fetching proof history:', error);
        res.status(500).json({ message: 'Error fetching proof history' });
    }
});

// Challenge a proof
router.post('/:proofHash/challenge', auth, async (req, res) => {
    try {
        const { proofHash } = req.params;
        const { reason, evidence } = req.body;

        if (!reason) {
            return res.status(400).json({ 
                message: 'Challenge reason is required' 
            });
        }

        // In a real implementation, you would:
        // 1. Record the challenge in your database
        // 2. Notify relevant parties
        // 3. Start the dispute resolution process

        res.json({
            success: true,
            challengeId: crypto.randomUUID(),
            message: 'Challenge submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting challenge:', error);
        res.status(500).json({ message: 'Error submitting proof challenge' });
    }
});

module.exports = router;
