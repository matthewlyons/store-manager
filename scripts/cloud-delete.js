const { connectDB } = require('../common/helpers');
const mongoose = require('mongoose');
connectDB().then((message) => {
  console.log(`Cloud Delete: ${message}`);

  mongoose.connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err);
    } else {
      names.forEach(function (e, i, a) {
        mongoose.connection.db.dropCollection(e.name);
        console.log('Deleing Collection: ', e.name);
      });
    }
  });
});
