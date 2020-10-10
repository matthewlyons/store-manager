const express = require('express');
const Moment = require('moment');
const fs = require('fs-extra');
const _ = require('underscore');

const router = express.Router();

// MongoDB Models
const { Order, DraftOrder } = require('../../../common/models/Order');
const Customer = require('../../../common/models/Customer');

// Get All Orders
router.get('/', async (req, res) => {
  let limit = req.body.limit || 10;
  let orders = await DraftOrder.find();
  res.json(orders);
});

// Create Draft Order
router.post('/', async (req, res) => {
  const NewOrder = new DraftOrder(req.body);
  console.log(NewOrder);
  let customer = await Customer.findOne({ _id: req.body.customer }).catch(
    (err) => {
      console.log(err);
      return res
        .status(404)
        .json({ errors: [{ message: 'No Customer Found' }] });
    }
  );
  await NewOrder.save()
    .then((response) => {
      customer.draftorders.unshift({ order: NewOrder._id });
      customer.save();
      res.json(response);
    })
    .catch((error) => {
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

// Single Draft Order Routes
router
  .route('/:id')
  // Get
  .get(async (req, res) => {
    let order = await DraftOrder.findOne({ _id: req.params.id })
      .populate('customer')
      .populate({ path: 'products.vendor', model: 'vendor' })
      .exec(function (err, order) {
        if (err)
          return res
            .status(404)
            .json({ errors: [{ message: 'No Draft Order Found' }] });
        res.json(order);
      });
  })
  // Update
  .put(async (req, res) => {
    console.log(req.params.id);
    await DraftOrder.updateOne({ _id: req.params.id }, req.body);
    let order = await DraftOrder.findOne({ _id: req.params.id });
    if (order) {
      res.json(order);
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Draft Order Found' }] });
    }
  })
  // Delete
  .delete(async (req, res) => {
    let order = await DraftOrder.findOne({ _id: req.params.id });

    if (order) {
      order.remove();
      res.json({ success: true });
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Draft Order Found' }] });
    }
  });

router.post('/convert/:id', async (req, res) => {
  console.log('GettingOrder');
  let order = await DraftOrder.findOne({ _id: req.params.id });

  if (!order) {
    return res
      .status(404)
      .json({ errors: [{ message: 'No Draft Order Found' }] });
  }

  let {
    address,
    products,
    delivery,
    salesTaxRate,
    itemTotal,
    salesTax,
    subTotal,
    totalDue,
    deposit,
    customer,
    employee,
    deliveryFee,
    phone,
    note,
    estimatedStoreArrival
  } = order;

  const NewOrder = new Order({
    address,
    products,
    delivery,
    salesTaxRate,
    itemTotal,
    salesTax,
    subTotal,
    totalDue,
    deposit,
    customer,
    employee,
    deliveryFee,
    phone,
    note,
    estimatedStoreArrival
  });

  let customerDB = await Customer.findOne({ _id: customer })
    .populate('orders.order')
    .populate('draftorders.order')
    .catch((err) => {
      console.log('Customer Error');
      console.log(err);
      return res
        .status(404)
        .json({ errors: [{ message: 'No Customer Found' }] });
    });

  await NewOrder.save()
    .then((response) => {
      customerDB.orders.unshift({ order: NewOrder._id });

      const customerDraftOrders = customerDB.draftorders.map(
        (element) => element.order._id
      );
      const orderRemoveIndex = customerDraftOrders.indexOf(req.params.id);
      customerDB.draftorders.splice(orderRemoveIndex, 1);

      customerDB.save();
      order.remove();
      res.json(response);
    })
    .catch((error) => {
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
          message: `Something Went Wrong`
        });
      }
      console.log(errArray);
      res.status(400).send({
        errors: errArray
      });
    });
});

module.exports = router;
