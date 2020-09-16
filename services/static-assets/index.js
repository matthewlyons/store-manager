const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chokidar = require('chokidar');
const cors = require('cors');
const { connectDB } = require('../../common/helpers');

const { convertImage } = require('./helpers');

connectDB().then((message) => {
  console.log(`Static Assets: ${message}`);
});

const app = express();

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
      key: fs.readFileSync(
        path.resolve(__dirname, './certificates/server.key')
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, './certificates/server.cert')
      )
    },
    app
  )
  .listen(port, function () {
    console.log(`Static Assets Listening on port ${port}.`);
  });
