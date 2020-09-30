const express = require('express');
const Moment = require('moment');
const fs = require('fs-extra');
const _ = require('underscore');

const router = express.Router();

// Helpers
const { logError } = require('../../../common/helpers');

// MongoDB Models
const { Order } = require('../../../common/models/Order');
const Customer = require('../../../common/models/Customer');

// Get All Orders
router.get('/', async (req, res) => {
  let limit = req.body.limit || 10;
  let orders = await Order.find()
    .sort({ date: -1 })
    .populate('products.product')
    .populate('customer')
    .limit(limit);
  res.json(orders);
});

// Create Order
router.post('/', async (req, res) => {
  const NewOrder = new Order(req.body);
  console.log(NewOrder);
  let customer = await Customer.findOne({ _id: req.body.customer });

  if (!customer) {
    return res.status(404).json({ errors: [{ message: 'No Customer Found' }] });
  }

  await NewOrder.save()
    .then((response) => {
      customer.orders.unshift({ order: NewOrder._id });
      customer.save();
      res.json(response);
    })
    .catch((error) => {
      logError(req, error);
      let errArray = [];
      if (error.name == 'ValidationError') {
        for (field in error.errors) {
          console.log(error.errors[field]);
          errArray.push({
            message: `Order Field: "${error.errors[field].path}" is required.`
          });
        }
      }
      if (errArray.length < 1) {
        errArray.push({
          message: 'Something Went Wrong'
        });
      }
      console.log(errArray);
      res.status(400).send({
        errors: errArray
      });
    });
});

// Single Order Routes
router
  .route('/:id')
  // Get
  .get(async (req, res) => {
    let order = await Order.findOne({ _id: req.params.id })
      .populate('customer')
      .populate({ path: 'products.vendor', model: 'vendor' });

    if (order) {
      console.log(order);
      res.json(order);
      // fs.writeFile('invoice.json', JSON.stringify(order), function (err) {
      //   console.log('Order Saved');
      // });
    } else {
      return res.status(404).json({ errors: [{ message: 'No Order Found' }] });
    }
  })
  // Update
  .put(async (req, res) => {
    console.log(req.body);
    await Order.updateOne({ _id: req.params.id }, req.body);
    let order = await Order.findOne({ _id: req.params.id });
    if (order) {
      res.json(order);
    } else {
      return res.status(404).json({ errors: [{ message: 'No Order Found' }] });
    }
  })
  // Delete
  .delete(async (req, res) => {
    let order = await Order.findOne({ _id: req.params.id });

    if (order) {
      order.remove();
      res.json({ success: true });
    } else {
      return res.status(404).json({ errors: [{ message: 'No Order Found' }] });
    }
  });

module.exports = router;
