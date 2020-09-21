const express = require('express');

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from assets folder');
});

router.post('/Select', (req, res) => {
  let { fileName } = req.body;
  console.log(fileName);
  fs.copyFile(
    path.resolve(__dirname + `/../assets/bulk/${fileName}`),
    path.resolve(__dirname + `/../assets/original/${fileName}`),
    async (err) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          errors: [
            {
              message: 'Something Went Wrong'
            }
          ]
        });
      }
      res.send('Done');
    }
  );
});

router.post('/Search', (req, res) => {
  let query = req.body.query.trim();
  let filePath = path.resolve(__dirname + '/../assets/bulk/');
  console.log(filePath);
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log(err);
      return res.json([]);
    }
    let regex = RegExp(query);
    let result = files.filter((file) => {
      if (regex.test(file)) {
        return file;
      }
    });

    res.json(result);
  });
});

// Download Image From URL
router.post('/url', async (req, res) => {
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
router.get('/base64/:file', (req, res) => {
  let bitmap = fs.readFileSync(
    path.resolve(__dirname, `./assets/converted/${req.params.file}`)
  );
  let response = new Buffer(bitmap).toString('base64');
  res.send(response);
});

module.exports = router;
