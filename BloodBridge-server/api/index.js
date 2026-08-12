const mongoose = require('mongoose');

if (process.env.VERCEL && process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
}

const app = require('../server');
module.exports = app;
