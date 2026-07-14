require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const donationRequestRoutes = require('./routes/donationRequests');
const blogRoutes = require('./routes/blogs');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://bloodbridge-client-ten.vercel.app',
    'https://bloodbridge-client.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

let cached = null;

async function connectDB() {
  if (cached && mongoose.connection.readyState === 1) {
    return cached;
  }
  cached = await mongoose.connect(process.env.MONGODB_URI);
  return cached;
}

app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donationRequests', donationRequestRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'BloodBridge API is running' });
});

if (!process.env.VERCEL) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Error:', err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
