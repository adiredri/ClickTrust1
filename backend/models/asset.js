const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  Category: {
    type: String,
    required: true
  },
  NameDigitalAsset: {
    type: String,
    required: true
  },
  Place: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Available: {
    type: Boolean,
    required: true,
  },
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;