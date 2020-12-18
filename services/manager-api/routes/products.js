const express = require('express');
const axios = require('axios');
const fs = require('fs');

const nodemailer = require('nodemailer');

const router = express.Router();

const mailerConfig = {
  host: 'smtp.office365.com',
  secureConnection: true,
  port: 587,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
};

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
  let transporter = nodemailer.createTransport(mailerConfig);

  let mailOptions = {
    from: 'Vancouver Woodworks <sales@vancouverwoodworks.com>',
    to: 'matt@lanternmediagroup.com',
    subject: 'Product Export',
    html: '<body><p>JSON Product Export</p></body>',
    attachments: [
      {
        // define custom content type for the attachment
        filename: 'products.json',
        content: jsonData,
        contentType: 'text/plain'
      }
    ]
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
      res.status(400).send({
        errors: [
          {
            message: 'Something Went Wrong'
          }
        ]
      });
    } else {
      res.send('Product Export Sent.');
    }
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

// Get Products By Vendor that don't have images
router.route('/Images').post(async (req, res) => {
  let { vendor } = req.body;
  Product.find({ vendor, image: undefined }).then((products) => {
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

router.get('/Vendor/:vendor/Search/:query', async (req, res) => {
  console.log('Finding Products');
  let { query, vendor } = req.params;
  Product.find({
    vendor,
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
      console.log(err);
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

router.post('/image', (req, res) => {
  let { fileName, id } = req.body;
  console.log('Selecting Image');
  axios
    .post('https://localhost:5004/Select', { fileName })
    .then(async (response) => {
      let product = await Product.findById(id);
      product.image = fileName;
      product.save();
      console.log('Saved Product');
      res.send('done');
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        errors: [
          {
            message: 'Something Went Wrong'
          }
        ]
      });
    });
});

// Product Routes
router
  .route('/:id')
  .get(async (req, res) => {
    Product.findOne({ _id: req.params.id })
      .populate('vendor')
      .exec(function (err, order) {
        if (err)
          return res
            .status(404)
            .json({ errors: [{ message: 'No Product Found' }] });
        res.json(order);
      });
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
    Product.findOne({ _id: req.params.id }).exec(function (err, product) {
      if (err)
        return res
          .status(404)
          .json({ errors: [{ message: 'No Product Found' }] });
      product.remove();
      return res.json({ success: true });
    });
  });

module.exports = router;
