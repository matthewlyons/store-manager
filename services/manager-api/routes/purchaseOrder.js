const express = require('express');
const router = express.Router();

// MongoDB Models
const { Order } = require('../../../common/models/Order');
const Vendor = require('../../../common/models/Vendor');

// Get all Unpurchased Products for each vendor
router.route('/Vendor/:id').get(async (req, res) => {
  let productArray = [];
  let vendorOrders = await Order.find({
    products: { $elemMatch: { vendor: req.params.id, purchased: false } }
  }).populate('customer');

  vendorOrders.forEach((order) => {
    order.products.forEach((product) => {
      if (!product.purchased) {
        productArray.push({
          ...product._doc,
          name: order.customer.name,
          order: order._id
        });
      }
    });
  });
  return res.json(productArray);
});

module.exports = router;
