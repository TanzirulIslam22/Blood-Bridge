const express = require('express');
const User = require('../models/User');
const DonationRecord = require('../models/DonationRecord');
const verifyToken = require('../middleware/verifyToken');
const { nextEligibleDate, isEligible } = require('../utils/gamification');
const { compatibleDonorGroups, isUniversalDonor } = require('../utils/bloodCompatibility');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({ role: 'donor', status: 'active' })
      .select('name email avatar bloodGroup district points badges donationCount')
      .sort({ points: -1, donationCount: -1 })
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/donors', async (req, res) => {
  try {
    const { bloodGroup, district, upazila, smart, includeCompatible } = req.query;
    const query = { role: 'donor', status: 'active' };

    if (bloodGroup) {
      if (includeCompatible === '1') {
        query.bloodGroup = { $in: compatibleDonorGroups(bloodGroup) };
      } else {
        query.bloodGroup = bloodGroup;
      }
    }
    if (district) query.district = district;
    if (upazila) query.upazila = upazila;

    const donors = await User.find(query).select('name email avatar bloodGroup district upazila lastDonationDate donationCount points badges height weight age institution createdAt').sort({ createdAt: -1 });

    const result = donors.map(donor => {
      const donorObj = donor.toObject();
      const eligible = isEligible(donor);
      donorObj.available = eligible;
      donorObj.nextEligibleDate = nextEligibleDate(donor.lastDonationDate);

      if (bloodGroup) {
        donorObj.compatibility = donor.bloodGroup === bloodGroup ? 'exact' : 'compatible';
        if (isUniversalDonor(donor.bloodGroup) && donor.bloodGroup !== bloodGroup) {
          donorObj.isUniversalDonor = true;
        }
      }

      if (smart === '1') {
        let score = 0;
        if (eligible) score += 50;
        else score -= 30;

        if (upazila && donor.upazila === upazila) score += 30;
        else if (district && donor.district === district) score += 20;

        if (donorObj.compatibility === 'exact') score += 15;
        else if (donorObj.compatibility === 'compatible') score += 5;

        if ((donor.donationCount || 0) > 0) score += 10;
        if ((donor.points || 0) >= 50) score += 10;
        if (donor.height && donor.weight) score += 5;

        donorObj.score = score;
        donorObj.matchReasons = [];
        if (eligible) donorObj.matchReasons.push('Available now');
        else donorObj.matchReasons.push('In cooldown');
        if (donorObj.compatibility === 'exact') donorObj.matchReasons.push('Exact blood match');
        else if (donorObj.compatibility === 'compatible') donorObj.matchReasons.push('Compatible blood type');
        if (upazila && donor.upazila === upazila) donorObj.matchReasons.push('Same upazila');
        else if (district && donor.district === district) donorObj.matchReasons.push('Same district');
        if ((donor.donationCount || 0) > 0) donorObj.matchReasons.push(`Experienced (${donor.donationCount} donation${donor.donationCount > 1 ? 's' : ''})`);
      }

      return donorObj;
    });

    if (smart === '1') {
      result.sort((a, b) => {
        const exactDiff = (b.compatibility === 'exact' ? 1 : 0) - (a.compatibility === 'exact' ? 1 : 0);
        if (exactDiff !== 0) return exactDiff;
        return (b.score || 0) - (a.score || 0);
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/donationRecords', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const records = await DonationRecord.find({ donorEmail: user.email })
      .sort({ donationDate: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, avatar, bloodGroup, district, upazila, height, weight, age, institution } = req.body;

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateFields = { name, avatar, bloodGroup, district, upazila };
    if (height) updateFields.height = parseFloat(height);
    if (weight) updateFields.weight = parseFloat(weight);
    if (age) updateFields.age = parseInt(age);
    if (institution !== undefined) updateFields.institution = institution;

    if (!existingUser.bloodGroup || !existingUser.district) {
      if (bloodGroup && district) {
        updateFields.points = (existingUser.points || 0) + 10;
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/block', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.json({ message: `User ${user.status === 'active' ? 'unblocked' : 'blocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/role', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { role } = req.body;
    if (!['admin', 'volunteer', 'donor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;