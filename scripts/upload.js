const fs = require('fs');
const mongoose = require('mongoose');

const { connectDB } = require('../common/helpers');

const Customer = require('../common/models/Customer');
const { DraftOrder, Order } = require('../common/models/Order');
const Product = require('../common/models/Product');
const User = require('../common/models/User');

const customerData = require('./backup/customers.json');
const orderData = require('./backup/orders.json');
const productData = require('./backup/products.json');
const userData = require('./backup/users.json');

let uploadToCloud = false;

connectDB(
  uploadToCloud
    ? 'mongodb://root:root@76.115.30.28:1234/vww-manager?authSource=admin'
    : null
).then((message) => {
  console.log(`Upload: ${message}`);

  let updatedCustomerData = customerData.map((doc) => {
    let orders = doc.orders.map((order) => {
      return { order };
    });
    return { ...doc, orders };
  });

  Customer.insertMany(updatedCustomerData, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log('Inserting Customers');
    console.log(docs);
  });

  Order.insertMany(orderData, (err, docs) => {
    if (err) {
      console.log(err);
    }

    console.log('Inserting Orders');
    console.log(docs);
  });

  Product.insertMany(productData, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log('Inserting Products');
    console.log(docs);
  });

  User.insertMany(userData, (err, docs) => {
    if (err) {
      console.log(err);
    }
    console.log('Inserting Users');
    console.log(docs);
  });
});
