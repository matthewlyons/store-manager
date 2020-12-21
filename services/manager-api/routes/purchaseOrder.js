const express = require('express');
const router = express.Router();

// MongoDB Models
const { Order } = require('../../../common/models/Order');
const Vendor = require('../../../common/models/Vendor');

router
  .route('/')
  // Create Purchase Order
  .post((req, res) => {
    res.send('Hello From POST Route');
  });

router
  .route('/:id')
  // Get Purchase Order
  .get((req, res) => {
    res.send('Hello From GET Route');
  })
  // Update Purchase Order
  .put((req, res) => {
    res.send('Hello From PUT Route');
  })
  // Delete Purchase Order
  .delete((req, res) => {
    res.send('Hello From DELETE Route');
  });

router
  .route('/Vendor/:id')
  // Get all Unpurchased Products for Vendor
  .get(async (req, res) => {
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
  })
  // Mark Purchased Products for Vendor as Purchased
  .post((req, res) => {
    res.send('Hello From POST Route');
  })
  // Mark All Unpurchased Products for Vendor as Purchased
  .delete((req, res) => {
    res.send('Hello From POST Route');
  });

module.exports = router;
