const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  vendor: {
    type: String,
    required: true
  },
  products: [
    {
      sku: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
      customer: {
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
