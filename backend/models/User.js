const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  gameStats: {
    type: Map,
    of: {
      wins: Number,
      losses: Number,
      totalWagered: Number,
      totalWon: Number
    },
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
