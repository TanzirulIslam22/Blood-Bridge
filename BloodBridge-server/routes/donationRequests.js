const express = require('express');
const DonationRequest = require('../models/DonationRequest');
const DonationRecord = require('../models/DonationRecord');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const { computeBadges } = require('../utils/gamification');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, email, page = 1, limit = 10, urgent } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (email) {
      query.requesterEmail = email;
    }

    if (urgent === 'true') {
      query.urgent = true;
    }

    const requests = await DonationRequest.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ urgent: -1, createdAt: -1 });

    const total = await DonationRequest.countDocuments(query);

    res.json({
      data: requests,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const requests = await DonationRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { requesterName, requesterEmail, recipientName, bloodGroup, hospitalName, fullAddress, district, upazila, donationDate, donationTime, requestMessage, urgent } = req.body;

    const newRequest = new DonationRequest({
      requesterName,
      requesterEmail,
      recipientName,
      bloodGroup,
      hospitalName,
      fullAddress,
      district,
      upazila,
      donationDate,
      donationTime,
      requestMessage,
      urgent: urgent === true || urgent === 'true',
      status: 'pending'
    });

    await newRequest.save();

    await User.findOneAndUpdate(
      { email: requesterEmail },
      { $inc: { points: 5 } }
    );

    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { recipientName, bloodGroup, hospitalName, fullAddress, district, upazila, donationDate, donationTime, requestMessage, urgent } = req.body;

    const request = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { recipientName, bloodGroup, hospitalName, fullAddress, district, upazila, donationDate, donationTime, requestMessage, urgent },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const request = await DonationRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/donate', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    const request = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'inprogress',
        donorInfo: { name, email }
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Donation accepted successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/complete', verifyToken, async (req, res) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updatedRequest = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'done' },
      { new: true }
    );

    if (request.donorInfo && request.donorInfo.email) {
      const donor = await User.findOne({ email: request.donorInfo.email });
      const now = new Date();

      const certificateId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

      await DonationRecord.create({
        donorName: request.donorInfo.name,
        donorEmail: request.donorInfo.email,
        recipientName: request.recipientName,
        bloodGroup: request.bloodGroup,
        hospitalName: request.hospitalName,
        district: request.district,
        donationDate: now,
        requestId: request._id,
        certificateId,
        wasUrgent: request.urgent
      });

      if (donor) {
        const donationCount = (donor.donationCount || 0) + 1;
        const points = (donor.points || 0) + 30 + (request.urgent ? 20 : 0);

        donor.lastDonationDate = now;
        donor.donationCount = donationCount;
        donor.points = points;
        donor.badges = computeBadges(donationCount);
        await donor.save();
      }
    }

    res.json({ message: 'Request completed successfully', request: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const request = await DonationRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'canceled' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request canceled successfully', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;