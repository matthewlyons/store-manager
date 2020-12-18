const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor',
    required: true
  },
  products: [
    {
      date: {
        type: String,
        required: true
      },
      sku: {
        type: String,
        required: true
      },
      vendorCollection: {
        type: String
      },
      title: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
      name: {
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

module.exports = PurchaseOrder = mongoose.model(
  'purchaseOrder',
  PurchaseOrderSchema
);
