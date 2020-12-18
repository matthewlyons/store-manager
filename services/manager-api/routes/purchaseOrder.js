const express = require('express');
const router = express.Router();

// MongoDB Models
const { Order } = require('../../../common/models/Order');
const Vendor = require('../../../common/models/Vendor');

// Get all Unpurchased Products for each vendor
router.route('/Vendor/:id').get(async (req, res) => {
  let vendor = await Vendor.findOne({ _id: req.params.id });
  let productArray = [];
  let vendorOrders = await Order.find({
    products: { $elemMatch: { vendor: req.params.id, purchased: false } }
  }).populate('customer');

  vendorOrders.forEach((order) => {
    order.products.forEach((product) => {
      if (!product.purchased && product.vendor === req.params.id) {
        productArray.push({
          ...product._doc,
          name: order.customer.name,
          order: order._id,
          date: order.date
        });
      }
    });
  });
  return res.json({ vendor, productArray });
});

module.exports = router;
