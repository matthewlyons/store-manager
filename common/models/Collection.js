const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Collection Schema
const CollectionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
      },
      place: {
        type: Number
      }
    }
  ]
});

module.exports = Collection = mongoose.model('Collection', CollectionSchema);
