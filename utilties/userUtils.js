// userUtils.js
const User = require('../models/User');

const getUserWithPopulatedGroceries = async (userId) => {
  try {
    const user = await User.findById(userId).populate('lists.groceries');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

module.exports = {
  getUserWithPopulatedGroceries,
};
