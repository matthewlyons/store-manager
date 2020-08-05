const express = require('express');
const router = express.Router();

// MongoDB Models
const Error = require('../../../common/models/Error');

// Get All Errrors
router.get('/', async (req, res) => {
  let errors = await Error.find().sort({ date: -1 });
  res.json(errors);
});

module.exports = router;
