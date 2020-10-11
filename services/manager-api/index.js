require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

const { connectDB } = require('../../common/helpers');

// // DB Config
// const db = MONGO_URI;
// mongoose
//   .connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
//   })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

connectDB().then((message) => {
  console.log(`Manager API: ${message}`);
});

app.get('/', (req, res) => {
  res.send('Hello from API Route');
});

app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/draftorders', require('./routes/draftOrder'));
app.use('/errors', require('./routes/errors'));
app.use('/products', require('./routes/products'));
app.use('/purchaseorder', require('./routes/purchaseOrder'));
app.use('/vendor', require('./routes/vendor'));
app.use('/visits', require('./routes/visits'));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  app.emit('appStarted');
});

module.exports.app = app;
