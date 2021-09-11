const mongoose = require('mongoose');
const { connectDB } = require('../common/helpers');

const fs = require('fs');
const path = require('path');

let localToCloud = false;

connectDB(
  localToCloud
    ? null
    : 'mongodb://root:root@76.115.30.28:1234/vww-manager?authSource=admin'
).then((message) => {
  console.log(`Migration: ${message}`);

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
  saveData(data, name);
}

function saveData(data, title) {
  let route = path.resolve(__dirname + `/backup/${title}.json`);
  fs.writeFile(route, JSON.stringify(data, null, 4), function (err) {
    if (err) console.error(err);
    else console.log(`Data Saved to ${title}.json file`);
  });
}
