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

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donationRequests', donationRequestRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'BloodBridge API is running' });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB Connected');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => console.log('MongoDB Error:', err));
}

module.exports = app;
