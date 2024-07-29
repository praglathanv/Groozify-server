const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // OTP will expire after 5 minutes
  }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
