const express = require('express');

const fs = require('fs');

const router = express.Router();

// MongoDB Models
const Product = require('../../../common/models/Product');

// Product Routes
router
  .route('/')
  .get(async (req, res) => {
    let products = await Product.find().populate('vendor');
    res.json(products);
  })
  .post(async (req, res) => {
    const NewProduct = new Product(req.body);
    NewProduct.save()
      .then((product) => {
        res.json(product);
      })
      .catch((error) => {
        let errArray = [];
        if (error.name == 'ValidationError') {
          for (field in error.errors) {
            console.log(error.errors[field]);
            errArray.push({
              message: `Product Field: "${error.errors[field].path}" is required.`
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

router.route('/Save').post(async (req, res) => {
  let products = await Product.find().populate('vendor');
  let jsonData = JSON.stringify({ data: products });
  fs.writeFile('products.json', jsonData, (err) => {
    if (err) {
      res.status(400).send({
        errors: [
          {
            message: 'Something Went Wrong'
          }
        ]
      });
    }
    res.send('Save Successful');
  });
});

// Get Products By Vendor
router.route('/Vendor').post(async (req, res) => {
  console.log(req.body.vendor);
  let { vendor } = req.body;
  Product.find({ vendor }).then((products) => {
    res.json(products);
  });
});

router.get('/Search/:Query', async (req, res) => {
  let query = req.params.Query;
  Product.find({
    $or: [
      { sku: { $regex: new RegExp(query, 'i') } },
      { title: { $regex: new RegExp(query, 'i') } },
      { vendorCollection: { $regex: new RegExp(query, 'i') } }
    ]
  })
    .limit(50)
    .populate('vendor')
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json([]);
    });
});
router.get('/color', async (req, res) => {
  Product.find({ color: { $ne: null } })
    .limit(50)
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.json([]);
    });
});

// Product Routes
router
  .route('/:id')
  .get(async (req, res) => {
    let product = await Product.findOne({ _id: req.params.id }).populate(
      'vendor'
    );
    console.log(product);
    if (product) {
      res.json(product);
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Product Found' }] });
    }
  })
  .post(async (req, res) => {
    Product.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      function (err, result) {
        if (err) {
          return res
            .status(500)
            .json({ errors: [{ message: 'Database Error' }] });
        }
        return res.send('Success');
      }
    );
  })
  .delete(async (req, res) => {
    let product = await Product.findOne({ _id: req.params.id });

    if (product) {
      product.remove();
      res.json({ success: true });
    } else {
      return res
        .status(404)
        .json({ errors: [{ message: 'No Product Found' }] });
    }
  });

module.exports = router;
