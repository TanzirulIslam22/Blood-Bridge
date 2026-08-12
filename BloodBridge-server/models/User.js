const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'volunteer', 'donor'], default: 'donor' },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''], default: '' },
  district: { type: String },
  upazila: { type: String },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  height: { type: Number },
  weight: { type: Number },
  age: { type: Number },
  institution: { type: String },
  lastDonationDate: { type: Date },
  donationCount: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);