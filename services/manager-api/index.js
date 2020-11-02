require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { connectDB, authFunction } = require('../../common/helpers');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

connectDB().then((message) => {
  console.log(`Manager API: ${message}`);
});

app.use(authFunction());

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

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, server };
