const express = require('express');
const router = express.Router();

// MongoDB Models
const Vendor = require('../../../common/models/Vendor');
// Single Order Routes

router
  .route('/')
  // Get All Vendors
  .get(async (req, res) => {
    let vendors = await Vendor.find();

    let result = vendors.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    res.json(result);
  })
  .post(async (req, res) => {
    let vendor = await Vendor.findOne({ name: req.body.name });
    if (vendor) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Vendor Already Exists' }] });
    }
    let NewVendor = new Vendor(req.body);

    NewVendor.save()
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        let errArray = [];
        if (error.name == 'ValidationError') {
          for (field in error.errors) {
            console.log(error.errors[field]);
            errArray.push({
              message: `Vendor Field: "${error.errors[field].path}" is required.`
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

// Single Vendor Routes
router
  .route('/:id')
  // Update Vendor
  .get(async (req, res) => {
    Vendor.findOne({ _id: req.params.id }).exec(function (err, order) {
      if (err)
        return res
          .status(404)
          .json({ errors: [{ message: 'No Vendor Found' }] });
      res.json(order);
    });
  })
  .put(async (req, res) => {
    await Vendor.updateOne({ _id: req.params.id }, req.body);
    let NewVendor = await Vendor.findOne({ _id: req.params.id });
    console.log(NewVendor);
    if (NewVendor) {
      res.json(NewVendor);
    } else {
      return res.status(404).json({ errors: [{ message: 'No Vendor Found' }] });
    }
  })
  // Delete Vendor
  .delete(async (req, res) => {
    let vendor = await Vendor.findOne({ _id: req.params.id });
    if (vendor) {
      vendor.remove();
      res.send('Success');
    } else {
      return res.status(404).json({ errors: [{ message: 'No Vendor Found' }] });
    }
  });

module.exports = router;
