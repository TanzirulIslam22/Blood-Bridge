const mongoose = require('mongoose');

const donationCampSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String },
  fullAddress: { type: String, required: true },
  campDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  bloodTarget: { type: Number, default: 50 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'canceled'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('DonationCamp', donationCampSchema);
