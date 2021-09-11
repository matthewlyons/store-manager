const { connectDB } = require('../common/helpers');
const mongoose = require('mongoose');

connectDB().then((message) => {
  console.log(`Local List: ${message}`);

  mongoose.connection.db.listCollections().toArray(function (err, names) {
    if (err) {
      console.log(err);
    } else {
      names.forEach(function (e, i, a) {
        mongoose.connection.db.collection(e.name, function (err, collection) {
          collection.find().toArray((err, data) => {
            callBackFunction(data, e.name);
          });
        });
      });
    }
  });
});

function callBackFunction(data, name) {
  console.log('Reciving');
  console.log(name);
  console.log(data);
}
