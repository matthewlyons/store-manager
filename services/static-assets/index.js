const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const cors = require('cors');

const { convertImage } = require('./helpers');

const app = express();

var selfsigned = require('selfsigned');
var attrs = [{ name: 'commonName', value: '76.115.30.28' }];
var pems = selfsigned.generate(attrs, { days: 365 });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get images
app.use(express.static(path.resolve(__dirname, 'assets', 'converted')));
app.use(express.static(path.resolve(__dirname, 'assets', 'bulk')));

app.use('/', require('./routes'));

// Watch /assets/original and convert new files to proper size
const fileLocation = path.join(__dirname + '/assets/original');
const watcher = chokidar.watch('.', {
  awaitWriteFinish: true,
  persistent: true,
  cwd: fileLocation
});

watcher.on('add', function (file) {
  let fileType = path.extname(file);
  if (fileType === '.png' || fileType === '.jpg') {
    convertImage(file);
  }
});

const port = process.env.PORT || 5004;

// Create HTTPS Server
https
  .createServer(
    {
      key: pems.private,
      cert: pems.cert
    },
    app
  )
  .listen(port, function () {
    console.log(`Static Assets Listening on port ${port}.`);
  });
