const express = require('express');
const { check, validationResult } = require('express-validator');

const { hashPassword } = require('../../../common/helpers');

const router = express.Router();

// MongoDB Models
const User = require('../../../common/models/User');

const { verifyAuth } = require('../../../common/helpers');

router.use(async (req, res, next) => {
  // Require Admin level 0 access
  let authHeader = req.headers['authorization'];
  let authToken = authHeader && authHeader.split(' ')[1];
  let authorized = await verifyAuth(authToken, 0);
  if (!authorized) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  next();
});

// Create New User
router.get('/', async (req, res) => {
  res.send('Hello World');
});

// Create New User
router.post('/', [check('password').isLength({ min: 5 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send({ message: 'Password Must Be 5 Characters Long' });
  }
  const NewUser = new User(req.body);
  NewUser.password = await hashPassword(req.body.password);
  NewUser.save()
    .then((User) => {
      res.json(User);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        message: 'Invalid Request'
      });
    });
});

// Delete User
router.delete('/:id', async (req, res) => {
  let user = await User.findOne({ _id: req.params.id });

  if (user) {
    user.remove();
    res.json({ success: true });
  } else {
    res.status(404).send({
      message: 'No User Found'
    });
  }
});

module.exports = router;
