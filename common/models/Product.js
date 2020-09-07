const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { updateProduct, processProduct, deleteProduct } = require('../helpers');

// Create Product Schema
const ProductSchema = new Schema({
  category: {
    type: String
  },
  subCategory: {
    type: String
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor',
    required: true
  },
  productCollection: {
    type: String
  },
  vendorCollection: {
    type: String
  },
  sku: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  compare_at_price: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  image: {
    type: String
  },
  imageURL: {
    type: String
  },
  description: {
    type: String
  },
  wood: {
    type: String
  },
  finish: {
    type: String
  },
  hardware: {
    type: String
  },
  width: {
    type: String
  },
  height: {
    type: String
  },
  depth: {
    type: String
  },
  length: {
    type: String
  },
  visible: {
    type: Boolean,
    default: true
  },
  shopifyID: {
    type: String
  },
  url: {
    type: String
  }
});

// Product Removed
ProductSchema.post('remove', function (doc) {
  // if shopify id, make request to shopify to delete product
});

// For update Pricing ONLY
ProductSchema.pre('findOneAndUpdate', function (next, doc) {
  // if shopify id update shopify
  next();
});

// For Update product data
ProductSchema.pre('findByIdAndUpdate', function (next, doc) {
  // if shopify id update shopify
  // if no shopify id create shopify product
  next();
});

ProductSchema.index({ '$**': 'text' });

module.exports = Product = mongoose.model('product', ProductSchema);
