const mongoose = require('mongoose');

const TaxRateSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = TaxRate = mongoose.model('TaxRate', TaxRateSchema);
