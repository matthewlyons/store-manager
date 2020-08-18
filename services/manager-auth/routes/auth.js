const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const { timeUntilMidnight } = require('../../../common/helpers');

// MongoDB Models
const User = require('../../../common/models/User');

// Login Route
router.post('/', async (req, res) => {
  let { name, password } = req.body;
  console.log(name);
  let user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ errors: [{ message: 'No User Found' }] });
  }
  console.log(user);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ errors: [{ message: 'Password Incorrect' }] });
  let [countdown, midnight] = timeUntilMidnight();
  console.log(countdown, midnight);
  const payload = {
    user: {
      _id: user._id
    }
  };
  jwt.sign(
    payload,
    process.env.API_SECRET,
    {
      expiresIn: countdown
    },
    (err, token) => {
      if (err) {
        console.log(err);
        res.status(404).json({ errors: [{ message: 'No User Found' }] });
      }
      console.log('Sending Token');
      res.json({
        user: { _id: user._id, name: user.name, access: user.access },
        token,
        exp: midnight
      });
    }
  );
});

// Customer Auth Route
router.post('/Customer', async (req, res) => {
  let { name, password } = req.body;
  let user = await User.findOne({ name });
  if (!user) {
    return res.status(404).json({ errors: [{ message: 'No User Found' }] });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ errors: [{ message: 'Password Incorrect' }] });
  const payload = {
    user: {
      _id: user._id
    }
  };
  jwt.sign(
    payload,
    process.env.CUST_SECRET,
    {
      expiresIn: 15 * 60
    },
    (err, token) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ errors: [{ message: 'No User Found' }] });
      }
      res.json({ token, exp: 15 * 60 });
    }
  );
});

module.exports = router;
