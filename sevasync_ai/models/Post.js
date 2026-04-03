const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  // Added Category to support the dropdown in your React Frontend
  category: { 
    type: String, 
    default: 'General' 
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // Updated Status to match Step 14 of your Final Flow Chart: 
  // Reported -> In Progress -> Completed
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Completed'],
    default: 'Reported',
  },
// SOS Specific Fields
  isEmergency: { type: Boolean, default: false },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);