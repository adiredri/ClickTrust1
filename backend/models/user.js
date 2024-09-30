const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: Number,
    required: true
  },
  Phone: {
    type: Number,
    required: true,
    unique: true
  },
  Birthday: {
    type: Date,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;