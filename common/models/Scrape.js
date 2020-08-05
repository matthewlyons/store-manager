const mongoose = require('mongoose');

const ErrorSchema = new mongoose.Schema({
  vendor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  errors: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Error = mongoose.model('error', ErrorSchema);
