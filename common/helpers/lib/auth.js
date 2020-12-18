const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports = {
  async verifyAuth(token, access) {
    try {
      let response = jwt.verify(token, process.env.API_SECRET);
      let { _id } = response.user;
      let user = await User.findById(_id);
      console.log(user);
      if (user.access > access) {
        console.log('Failed');
        return false;
      } else {
        console.log('Succeeded');
        console.log(user.access);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  authFunction() {
    return async function (req, res, next) {
      try {
        let token = req.headers.authorization.split(' ')[1];
        let response = jwt.verify(token, process.env.API_SECRET);
        let { _id } = response.user;
        let user = await User.findById(_id);
        if (!user) {
          return res
            .status(401)
            .json({ errors: [{ message: 'Unauthorized' }] });
        }
      } catch (error) {
        return res.status(401).json({ errors: [{ message: 'Unauthorized' }] });
      }
      next();
    };
  },
  verifyCustomerAuth(token, access) {
    return true;
  },
  async hashPassword(password) {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
  }
};
