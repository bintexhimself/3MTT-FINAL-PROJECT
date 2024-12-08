const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});




// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
