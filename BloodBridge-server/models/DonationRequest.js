const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  hospitalName: { type: String, required: true },
  fullAddress: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
  donationDate: { type: Date, required: true },
  donationTime: { type: String, required: true },
  requestMessage: { type: String },
  status: { type: String, enum: ['pending', 'inprogress', 'done', 'canceled'], default: 'pending' },
  donorInfo: {
    name: { type: String },
    email: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('DonationRequest', donationRequestSchema);