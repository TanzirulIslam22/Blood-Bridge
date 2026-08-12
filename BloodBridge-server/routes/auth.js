const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findUserByEmail = (email) => {
  const normalized = normalizeEmail(email);
  return User.findOne({ email: { $regex: `^${escapeRegex(normalized)}$`, $options: 'i' } });
};

router.post('/jwt', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'User is blocked' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email: rawEmail, avatar, bloodGroup, district, upazila } = req.body;
    const email = normalizeEmail(rawEmail);

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      avatar: avatar || '',
      bloodGroup,
      district,
      upazila,
      role: 'donor',
      status: 'active',
      points: bloodGroup && district ? 10 : 0
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
