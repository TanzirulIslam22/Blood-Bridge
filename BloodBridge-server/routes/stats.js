const express = require('express');
const User = require('../models/User');
const DonationRequest = require('../models/DonationRequest');
const DonationRecord = require('../models/DonationRecord');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const totalDonors = await User.countDocuments({ role: 'donor', status: 'active' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer', status: 'active' });
    const totalRequests = await DonationRequest.countDocuments();
    const completedRequests = await DonationRequest.countDocuments({ status: 'done' });
    const urgentRequests = await DonationRequest.countDocuments({ urgent: true, status: { $ne: 'done' } });
    const totalDonations = await DonationRecord.countDocuments();

    res.json({
      totalDonors,
      totalVolunteers,
      totalRequests,
      completedRequests,
      urgentRequests,
      totalDonations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;