const express = require('express');
const DonationRecord = require('../models/DonationRecord');

const router = express.Router();

router.get('/:certificateId', async (req, res) => {
  try {
    const record = await DonationRecord.findOne({ certificateId: req.params.certificateId });
    if (!record) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
