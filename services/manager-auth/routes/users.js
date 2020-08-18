const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const { hashPassword } = require('../../../common/helpers');

const router = express.Router();

// MongoDB Models
const User = require('../../../common/models/User');

// Get All User Names
router.get('/', (req, res) => {
  User.find()
    .then((users) => {
      let userArray = users.map((user) => {
        return { name: user.name, _id: user._id };
      });
      res.json(userArray);
    })
    .catch((err) => console.log(err));
});

// Change User Password
router
  .route('/:id')
  .post([check('new_password_1').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: [{ message: 'Password Must Be 5 Characters Long' }] });
    }

    let { current_password, new_password_1, new_password_2 } = req.body;

    // Find User by ID
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ errors: [{ message: 'No User Found' }] });

    // Verify Current Password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) return res.status(401).json({ errors: [{ message: 'Password Incorrect' }] });

    // Verify new passwords match

    if (new_password_1 !== new_password_2)
      return res.status(400).json({ errors: [{ message: 'Passwords Do Not Match' }] });

    user.password = await hashPassword(new_password_1);
    user.save().then((user) => {
      res.send('Success');
    });
  })
  // Change User Name
  .put(async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ errors: [{ message: 'No User Found' }] });
    user.name = req.body.name;
    user.save().then((user) => {
      res.send('Success');
    });
  });

module.exports = router;
