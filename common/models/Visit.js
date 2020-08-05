const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Visit Schema
const VisitSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  room: {
    type: String,
    required: true
  },
  customerAge: {
    type: String,
    required: true
  },
  customerReturn: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customer'
  }
});

module.exports = Visit = mongoose.model('visit', VisitSchema);
