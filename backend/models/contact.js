const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Phone: {
    type: Number,
    required: true,
    unique: true
  },
  Massege: {
    type: String,
    required: true
  },
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;