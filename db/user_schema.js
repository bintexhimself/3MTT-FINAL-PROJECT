const mongoose = require('mongoose');

// Define the User schema
const userSchema = mongoose.Schema({
  username: {
    type: String,

  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    
    
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
