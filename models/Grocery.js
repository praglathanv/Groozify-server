const mongoose = require('mongoose');

// Define grocery schema
const grocerySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  }
});

// Create Grocery model
const Grocery = mongoose.model('Grocery', grocerySchema);

module.exports = Grocery;
