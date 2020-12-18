const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
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
  baseVendorCode: {
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
  contactInformation: {
    purchaseOrderEmail: {
      type: String
    },
    contacts: [
      {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String
        },
        phone: {
          type: String
        }
      }
    ]
  },
  purchaseOrders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'purchaseOrder'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Vendor = mongoose.model('vendor', VendorSchema);
