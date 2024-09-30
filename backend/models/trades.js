const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  TransDate: {
    type: Date,
    required: true,
  },
  TransTime: {
    type: String,
    required: true
  },
  AssetID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assets',
    required: true
  },
  SellerEmail: {
    type: String,
    required: true,
  },
  BuyerEmail: {
    type: String,
    required: true,
  },
});

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;