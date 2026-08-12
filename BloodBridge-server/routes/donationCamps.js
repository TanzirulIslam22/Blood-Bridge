const express = require('express');
const DonationCamp = require('../models/DonationCamp');
const CampRegistration = require('../models/CampRegistration');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    } else {
      query.status = { $in: ['upcoming', 'ongoing'] };
    }

    const camps = await DonationCamp.find(query)
      .limit(parseInt(limit))
      .sort({ campDate: 1 });

    const results = await Promise.all(camps.map(async (camp) => {
      const registrationCount = await CampRegistration.countDocuments({ campId: camp._id, status: 'confirmed' });
      const attendedCount = await CampRegistration.countDocuments({ campId: camp._id, attended: true });
      return {
        ...camp.toObject(),
        registrationCount,
        attendedCount
      };
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const camps = await DonationCamp.find({ organizerEmail: req.user.email })
      .sort({ campDate: -1 });

    const registrations = await CampRegistration.find({ donorEmail: req.user.email })
      .populate('campId');

    res.json({ camps, registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    const registrationCount = await CampRegistration.countDocuments({ campId: camp._id, status: 'confirmed' });
    const attendedCount = await CampRegistration.countDocuments({ campId: camp._id, attended: true });

    res.json({ ...camp.toObject(), registrationCount, attendedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/registrations', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registrations = await CampRegistration.find({ campId: camp._id })
      .sort({ createdAt: 1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'volunteer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, thumbnail, district, upazila, fullAddress, campDate, startTime, endTime, bloodTarget } = req.body;

    const newCamp = new DonationCamp({
      title,
      description,
      thumbnail,
      organizerName: req.body.organizerName || req.user.name,
      organizerEmail: req.user.email,
      district,
      upazila,
      fullAddress,
      campDate,
      startTime,
      endTime,
      bloodTarget,
      status: 'upcoming'
    });

    await newCamp.save();
    res.status(201).json({ message: 'Camp created successfully', camp: newCamp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    const existing = await CampRegistration.findOne({ campId: camp._id, donorEmail: req.user.email });
    if (existing) {
      if (existing.status === 'canceled') {
        existing.status = 'confirmed';
        await existing.save();
        return res.json({ message: 'Registration re-confirmed', registration: existing });
      }
      return res.status(400).json({ message: 'Already registered' });
    }

    const user = await User.findOne({ email: req.user.email });

    const registration = await CampRegistration.create({
      campId: camp._id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      bloodGroup: user?.bloodGroup || req.body.bloodGroup || ''
    });

    if (user) {
      user.points = (user.points || 0) + 5;
      await user.save();
    }

    res.status(201).json({ message: 'Registered for camp successfully (+5 points)', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, thumbnail, district, upazila, fullAddress, campDate, startTime, endTime, bloodTarget, status } = req.body;

    const updatedCamp = await DonationCamp.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail, district, upazila, fullAddress, campDate, startTime, endTime, bloodTarget, status },
      { new: true }
    );

    res.json({ message: 'Camp updated successfully', camp: updatedCamp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/registrations/:registrationId/attend', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registration = await CampRegistration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.attended = !registration.attended;
    await registration.save();

    if (registration.attended) {
      const user = await User.findOne({ email: registration.donorEmail });
      if (user) {
        user.points = (user.points || 0) + 15;
        await user.save();
      }
    }

    res.json({ message: 'Attendance updated', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/registrations/:registrationId/cancel', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registration = await CampRegistration.findByIdAndUpdate(
      req.params.registrationId,
      { status: 'canceled', attended: false },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration canceled', registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const camp = await DonationCamp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: 'Camp not found' });
    }

    if (camp.organizerEmail !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await CampRegistration.deleteMany({ campId: camp._id });
    await DonationCamp.findByIdAndDelete(req.params.id);

    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/registrations/:registrationId', verifyToken, async (req, res) => {
  try {
    const registration = await CampRegistration.findOne({ _id: req.params.registrationId, donorEmail: req.user.email });
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await CampRegistration.findByIdAndDelete(registration._id);
    res.json({ message: 'Registration removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
