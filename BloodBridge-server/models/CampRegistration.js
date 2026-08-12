const mongoose = require('mongoose');

const campRegistrationSchema = new mongoose.Schema({
  campId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationCamp', required: true },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  bloodGroup: { type: String, default: '' },
  status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
  attended: { type: Boolean, default: false }
}, { timestamps: true });

campRegistrationSchema.index({ campId: 1, donorEmail: 1 }, { unique: true });

module.exports = mongoose.model('CampRegistration', campRegistrationSchema);
