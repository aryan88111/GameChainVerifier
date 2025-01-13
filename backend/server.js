require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const winston = require('winston');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const wagerRoutes = require('./routes/wagerRoutes');
const proofRoutes = require('./routes/proofRoutes');
const activityRoutes = require('./routes/activityRoutes');
const statsRoutes = require('./routes/statsRoutes');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamechain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Database connected successfully.');
}).catch((err) => {
  console.error('Database connection error:', err.message);});

class GameChainServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.port = process.env.PORT || 5000;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
  }

  initializeMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  initializeRoutes() {
    // Simple route initialization
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/games', gameRoutes);
    this.app.use('/api/wagers', wagerRoutes);
    this.app.use('/api/proofs', proofRoutes);
    this.app.use('/api/activities', activityRoutes);
    this.app.use('/api/stats', statsRoutes);
  }

  setupWebSocket() {
    const tryPort = (port) => {
      return new Promise((resolve, reject) => {
        const server = this.app.listen(port)
          .on('listening', () => {
            console.log(`Server is running on port ${port}`);
            resolve(server);
          })
          .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`Port ${port} is busy, trying ${port + 1}...`);
              resolve(tryPort(port + 1));
            } else {
              reject(err);
            }
          });
      });
    };

    tryPort(this.port)
      .then(server => {
        this.server = server;
        const io = socketIO(this.server, {
          cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
          }
        });

        io.on('connection', (socket) => {
          console.log('Client connected:', socket.id);
          
          socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
          });

          // Add game-specific socket events here
          socket.on('join_game', (gameId) => {
            socket.join(gameId);
            io.to(gameId).emit('player_joined', { playerId: socket.id });
          });

          socket.on('game_action', (data) => {
            io.to(data.gameId).emit('game_update', data);
          });
        });
      })
      .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
      });
  }

  connectDatabase() {
    const retryConnection = (retries = 5, delay = 5000) => {
      mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamechain', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log('Database connected successfully.');
      }).catch((err) => {
        console.error('Database connection error:', err.message);
        if (retries > 0) {
          console.log(`Retrying connection in ${delay/1000} seconds... (${retries} attempts remaining)`);
          setTimeout(() => retryConnection(retries - 1, delay), delay);
        } else {
          console.error('Failed to connect to MongoDB after multiple attempts.');
          console.log('Make sure MongoDB is installed and running:');
          console.log('1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community');
          console.log('2. Install MongoDB with MongoDB Compass');
          console.log('3. Start MongoDB service');
          console.log('4. Or use MongoDB Atlas by updating MONGODB_URI in .env');
        }
      });
    };

    retryConnection();
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

new GameChainServer();
