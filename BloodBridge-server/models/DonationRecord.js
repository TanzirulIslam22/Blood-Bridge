const mongoose = require('mongoose');

const donationRecordSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  hospitalName: { type: String, required: true },
  district: { type: String },
  donationDate: { type: Date, required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationRequest' },
  certificateId: { type: String, unique: true, required: true },
  wasUrgent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('DonationRecord', donationRecordSchema);
