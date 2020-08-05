const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  showPricing: {
    type: Boolean,
    default: true
  },
  VendorCode: {
    type: String
  },
  vendorCodes: [
    {
      code: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Vendor = mongoose.model('vendor', VendorSchema);
