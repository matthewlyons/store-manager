const express = require('express');

const router = express.Router();

const { logError } = require('../../../common/helpers');

// MongoDB Models
const Customer = require('../../../common/models/Customer');

// Search Customers
router.get('/search/:Query', async (req, res) => {
  let customers = await Customer.find({
    name: { $regex: new RegExp(req.params.Query, 'i') }
  }).limit(100);

  res.json(customers);
});

// Single Customer Routes
router
  .route('/:id')
  // Get
  .get((req, res) => {
    console.log('Finging Customer');
    Customer.findOne({ _id: req.params.id })
      .populate('orders.order')
      .populate('draftorders.order')
      .then((customer) => {
        console.log(customer);
        res.json(customer);
      })
      .catch((err) => {
        console.log(err);
        logError(req, err);
        return res
          .status(404)
          .json({ errors: [{ message: 'No Customer Found' }] });
      });
  })
  // Update
  .put(async (req, res) => {
    await Customer.updateOne({ _id: req.params.id }, req.body);
    let customer = await Customer.findOne({ _id: req.params.id });
    if (customer) {
      res.json(customer);
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Customer Found' }] });
    }
  })
  // Delete
  .delete(async (req, res) => {
    let customer = await Customer.findOne({ _id: req.params.id });

    if (customer) {
      customer.remove();
      res.json({ success: true });
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Customer Found' }] });
    }
  });

// Create Customer
router.post('/', async (req, res) => {
  const NewCustomer = new Customer(req.body);
  console.log(NewCustomer);
  NewCustomer.save()
    .then((customer) => {
      console.log("Success in creating customer")
      res.json(customer);
    })
    .catch((error) => {
      logError(req, error);
      let errArray = [];
      if (error.name == 'ValidationError') {
        for (field in error.errors) {
          console.log(error.errors[field]);
          errArray.push({
            message: `Customer Field: "${error.errors[field].path}" is required.`
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
