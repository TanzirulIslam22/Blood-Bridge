const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String },
  content: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  authorName: { type: String },
  authorEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);