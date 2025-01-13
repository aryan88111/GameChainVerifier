const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Web3 } = require('web3');
const GameWager = require('../blockchain/contracts/GameWager.json');
const path = require('path');
const fs = require('fs');

let web3;
let gameWagerContract;

const initializeContract = async () => {
    try {
        // Initialize Web3 with fallback to local node
        const nodeUrl = process.env.ETHEREUM_NODE_URL || 'https://mainnet.infura.io/v3/4bd1659e9d3c46018786b22ad706c1bd';
        web3 = new Web3(nodeUrl);

        // Try to get contract address from environment variable or deployment file
        let contractAddress = process.env.GAME_WAGER_CONTRACT_ADDRESS;

        if (!contractAddress) {
            const deploymentPath = path.join(__dirname, '../blockchain/deployments/local/GameWager.json');
            if (fs.existsSync(deploymentPath)) {
                const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
                contractAddress = deployment.address;
            }
        }

        if (!contractAddress) {
            throw new Error('Contract address not found in environment or deployment file');
        }

        console.log('Initializing contract at address:', contractAddress);

        // Initialize contract
        gameWagerContract = new web3.eth.Contract(
            GameWager.abi,
            contractAddress
        );

        // Verify contract is deployed
        const code = await web3.eth.getCode(contractAddress);
        if (code === '0x') {
            throw new Error('No contract deployed at the specified address');
        }

        console.log('GameWager contract initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing contract:', error);
        return false;
    }
};

// Initialize contract on startup
initializeContract().catch(console.error);

// Middleware to ensure contract is initialized
const ensureContract = async (req, res, next) => {
    if (!gameWagerContract) {
        try {
            const initialized = await initializeContract();
            if (!initialized) {
                return res.status(503).json({
                    message: 'Wager service not available - contract initialization failed'
                });
            }
        } catch (error) {
            console.error('Contract initialization error:', error);
            return res.status(503).json({
                message: 'Wager service not available - contract initialization failed',
                details: error.message
            });
        }
    }
    next();
};

// Apply ensureContract middleware to all routes
router.use(ensureContract);

// Create a new wager
router.post('/', auth, async (req, res) => {
    try {
        const { opponent, amount, gameHash } = req.body;

        // Create wager on blockchain
        const wager = await gameWagerContract.methods
            .createWager(opponent, gameHash)
            .send({
                from: req.user.walletAddress,
                value: web3.utils.toWei(amount.toString(), 'ether')
            });

        res.json({
            wagerId: wager.events.WagerCreated.returnValues.wagerId,
            transactionHash: wager.transactionHash
        });
    } catch (error) {
        console.error('Error creating wager:', error);
        res.status(500).json({ 
            message: error.message || 'Error creating wager',
            details: error.reason || error.error?.message
        });
    }
});

// Get active wagers - This needs to come before /:wagerId to prevent route conflicts
router.get('/active', auth, async (req, res) => {
    try {
        console.log('Fetching active wagers for user:', req.user.walletAddress);

        const wagerCount = await gameWagerContract.methods.getWagerCount().call();
        console.log('Total wager count:', wagerCount);

        const activeWagers = [];

        for (let i = 0; i < wagerCount; i++) {
            try {
                const wager = await gameWagerContract.methods.getWager(i).call();
                console.log(`Wager ${i}:`, wager);
                
                if (!wager.completed && 
                    (wager.creator === req.user.walletAddress || 
                     wager.opponent === req.user.walletAddress)) {
                    activeWagers.push({
                        id: i,
                        creator: wager.creator,
                        opponent: wager.opponent,
                        amount: web3.utils.fromWei(wager.amount, 'ether'),
                        gameHash: wager.gameHash,
                        accepted: wager.accepted,
                        completed: wager.completed,
                        winner: wager.winner
                    });
                }
            } catch (err) {
                console.error(`Error fetching wager ${i}:`, err);
                // Continue with next wager
            }
        }

        console.log('Active wagers found:', activeWagers.length);
        res.json(activeWagers);
    } catch (error) {
        console.error('Error fetching active wagers:', error);
        res.status(500).json({ 
            message: error.message || 'Error fetching active wagers',
            details: error.reason || error.error?.message
        });
    }
});

// Accept a wager
router.post('/:wagerId/accept', auth, async (req, res) => {
    try {
        const { wagerId } = req.params;
        const wager = await gameWagerContract.methods
            .acceptWager(wagerId)
            .send({
                from: req.user.walletAddress,
                value: web3.utils.toWei(req.body.amount.toString(), 'ether')
            });

        res.json({
            success: true,
            transactionHash: wager.transactionHash
        });
    } catch (error) {
        console.error('Error accepting wager:', error);
        res.status(500).json({ 
            message: error.message || 'Error accepting wager',
            details: error.reason || error.error?.message
        });
    }
});

// Get wager details - This should come after /active
router.get('/:wagerId', auth, async (req, res) => {
    try {
        const { wagerId } = req.params;
        const wager = await gameWagerContract.methods.getWager(wagerId).call();

        res.json({
            creator: wager.creator,
            opponent: wager.opponent,
            amount: web3.utils.fromWei(wager.amount, 'ether'),
            gameHash: wager.gameHash,
            accepted: wager.accepted,
            completed: wager.completed,
            winner: wager.winner
        });
    } catch (error) {
        console.error('Error fetching wager:', error);
        res.status(500).json({ 
            message: error.message || 'Error fetching wager details',
            details: error.reason || error.error?.message
        });
    }
});

// Resolve a wager
router.post('/:wagerId/resolve', auth, async (req, res) => {
    try {
        const { wagerId } = req.params;
        const { winner } = req.body;

        const wager = await gameWagerContract.methods
            .resolveWager(wagerId, winner)
            .send({ from: req.user.walletAddress });

        res.json({
            success: true,
            transactionHash: wager.transactionHash
        });
    } catch (error) {
        console.error('Error resolving wager:', error);
        res.status(500).json({ 
            message: error.message || 'Error resolving wager',
            details: error.reason || error.error?.message
        });
    }
});

// Get wager activity stats
router.get('/activity', auth, async (req, res) => {
    try {
        const wagerCount = await gameWagerContract.methods.getWagerCount().call();
        const today = new Date();
        const activityData = {
            daily: new Array(7).fill(0), // Last 7 days
            volume: 0,
            totalWagers: 0,
            activeWagers: 0
        };

        for (let i = 0; i < wagerCount; i++) {
            try {
                const wager = await gameWagerContract.methods.getWager(i).call();
                const wagerAmount = parseFloat(web3.utils.fromWei(wager.amount, 'ether'));
                
                // Get wager creation timestamp from blockchain
                const block = await web3.eth.getBlock(wager.blockNumber);
                const wagerDate = new Date(block.timestamp * 1000);
                
                // Calculate days ago
                const daysAgo = Math.floor((today - wagerDate) / (1000 * 60 * 60 * 24));
                
                // Add to daily stats if within last 7 days
                if (daysAgo < 7) {
                    activityData.daily[daysAgo] += wagerAmount;
                }
                
                // Update total stats
                activityData.volume += wagerAmount;
                activityData.totalWagers++;
                if (!wager.completed) {
                    activityData.activeWagers++;
                }
            } catch (err) {
                console.error(`Error processing wager ${i}:`, err);
            }
        }

        res.json(activityData);
    } catch (error) {
        console.error('Error fetching wager activity:', error);
        res.status(500).json({ 
            message: error.message || 'Error fetching wager activity',
            details: error.reason || error.error?.message
        });
    }
});

module.exports = router;
