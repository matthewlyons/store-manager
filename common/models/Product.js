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
    type: Number
  },
  height: {
    type: Number
  },
  depth: {
    type: Number
  },
  length: {
    type: Number
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

// Create or Update Product with Pricing and Information
// Single Product Updates
// Bulk Product Scrape
ProductSchema.pre('save', async function (next) {
  next();
});

// Product Removed
ProductSchema.post('remove', function (doc) {});

// Create or Update Product with Pricing
// Bulk Pricing Updates
ProductSchema.pre('findOneAndUpdate', function (next, doc) {
  next();
});

ProductSchema.index({ '$**': 'text' });

module.exports = Product = mongoose.model('product', ProductSchema);
