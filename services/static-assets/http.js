const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

// Get images
app.use(express.static(path.resolve(__dirname, 'assets', 'converted')));
app.use(express.static(path.resolve(__dirname, 'assets', 'bulk')));

app.use('/', require('./routes'));

const port = process.env.PORT || 5007;

app.listen(port, () => {
  console.log(`Static Assets Listening on HTTP Port ${port}.`);
});
