const mongoose = require('mongoose');

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000
    });
  }

  try {
    await connectionPromise;
  } catch (err) {
    connectionPromise = null;
    throw err;
  }

  return mongoose;
}

module.exports = { connectDB };
