const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Customer Schema
const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: [String],
  addresses: [
    {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zip: {
        type: String,
        required: true
      },
      unit: {
        type: String
      },
      comment: {
        type: String
      }
    }
  ],
  phone: [
    {
      number: {
        type: String,
        required: true
      },
      comment: {
        type: String
      }
    }
  ],
  notes: [
    {
      date: {
        type: Date,
        default: Date.now()
      },
      comment: {
        type: String,
        required: true
      },
      staff: {
        type: String,
        required: true
      }
    }
  ],
  orders: [
    {
      order: {
        type: Schema.Types.ObjectId,
        ref: 'order'
      }
    }
  ],
  draftorders: [
    {
      order: {
        type: Schema.Types.ObjectId,
        ref: 'draftOrder'
      }
    }
  ]
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
