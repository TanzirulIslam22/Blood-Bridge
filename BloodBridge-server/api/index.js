const { connectDB } = require('../config/db');

if (process.env.VERCEL && process.env.MONGODB_URI) {
  connectDB().catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
}

const app = require('../server');
module.exports = app;
