const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Community User' },
  // ADD THESE TWO FIELDS FOR PASSWORD RESET:
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('User', UserSchema);