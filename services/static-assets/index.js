const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chokidar = require('chokidar');

const { convertImage } = require('./helpers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get images
app.use(express.static(path.resolve(__dirname, 'assets', 'converted')));

app.get('/', (req, res) => {
  res.send('Hello from assets folder');
});

// Download Image From URL
app.post('/url', async (req, res) => {
  const { url } = req.body;
  let lastIndex = url.lastIndexOf('?') > -1 ? url.lastIndexOf('?') : url.length;
  let fileName = url.substring(url.lastIndexOf('/') + 1, lastIndex);
  const writer = fs.createWriteStream(
    path.resolve(__dirname, 'assets', 'original', fileName)
  );
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  writer.on('finish', () => {
    res.send('Done');
  });
  writer.on('error', () => {
    res.send('Error');
  });
});

// Get images as Base64 encoded string
app.get('/base64/:file', (req, res) => {
  let bitmap = fs.readFileSync(
    path.resolve(__dirname, `./assets/converted/${req.params.file}`)
  );
  let response = new Buffer(bitmap).toString('base64');
  res.send(response);
});

// Watch /assets/original and convert new files to proper size
const fileLocation = path.join(__dirname + '/assets/original');
const watcher = chokidar.watch('.', {
  awaitWriteFinish: true,
  persistent: true,
  cwd: fileLocation
});

watcher.on('add', function (path) {
  console.log(path);
  convertImage(path);
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
    console.log(`Listening on port ${port}.`);
  });
