const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // You can remove this if you don't use it

const grocerySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    default: ''
  },
  quantity: {
    type: String,
    required: true,
    default: ''
  }
});

// Define list schema
const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  groceries: [grocerySchema] // Use grocerySchema here
});

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  verificationToken: {
    type: String, // Store OTP or token
    default: '', 
    required: false, 
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lists: [listSchema]  // Array of lists
});

// Define a method to generate a verification token
userSchema.methods.generateVerificationToken = function() {
  // Implement token generation logic, e.g., using a library like crypto
  this.verificationToken = Math.random().toString(36).substring(2, 15); // Simple random token for demonstration
};

// Define a method to verify email
userSchema.methods.verifyEmail = function(token) {
  return this.verificationToken === token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
