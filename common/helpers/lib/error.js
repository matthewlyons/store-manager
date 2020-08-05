require('dotenv').config();

const Error = require('../../models/Error');

module.exports = {
  logError(req, error) {
    console.log('Error Occured');
    let { originalUrl, method, body } = req;
    let errorBody = JSON.stringify(body);
    console.log(originalUrl);
    let newError = new Error({
      method,
      route: originalUrl,
      body: errorBody,
      error
    });
    newError.save();
  }
};
