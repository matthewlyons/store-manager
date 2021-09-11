const mongoose = require('mongoose');
const { connectDB } = require('../common/helpers');

connectDB(
  'mongodb://root:root@76.115.30.28:1234/vww-manager?authSource=admin'
).then((message) => {
  console.log(`Cloud List: ${message}`);

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
