const mongoose = require('mongoose');

const ErrorSchema = new mongoose.Schema({
  method: {
    type: String
  },
  route: {
    type: String
  },
  body: {
    type: String
  },
  error: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Error = mongoose.model('error', ErrorSchema);
