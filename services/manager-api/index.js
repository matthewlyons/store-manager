require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { connectDB } = require('../../common/helpers');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from API Route');
});

app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));
app.use('/draftorders', require('./routes/draftOrder'));
app.use('/errors', require('./routes/errors'));
app.use('/products', require('./routes/products'));
app.use('/vendor', require('./routes/vendor'));
app.use('/visits', require('./routes/visits'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
