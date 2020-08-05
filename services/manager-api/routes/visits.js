const express = require('express');

const router = express.Router();

// MongoDB Models
const Visit = require('../../../common/models/Visit');

// Get all visits
router.get('/', (req, res) => {
  Visit.find()
    .populate('user')
    .then((visits) => {
      res.json(visits);
    })
    .catch((err) => console.log(err));
});

// Create New Visit
router.post('/', (req, res) => {
  const NewVisit = new Visit(req.body);
  NewVisit.save()
    .then((Visit) => {
      res.json(Visit);
    })
    .catch((error) => {
      let errArray = [];
      if (error.name == 'ValidationError') {
        for (field in error.errors) {
          console.log(error.errors[field]);
          errArray.push({
            message: `Visit Field: "${error.errors[field].path}" is required.`
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

// Get NUM most recent visits
router.get('/recent/:num', (req, res) => {
  Visit.find()
    .limit(5)
    .sort({ _id: -1 })
    .populate('user')
    .then((visits) => {
      res.json(visits);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
