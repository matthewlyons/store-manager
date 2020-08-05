const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

let imageQueue = [];

module.exports = {
  async convertImage(file) {
    const originalPath = path.resolve(__dirname + '../../assets/original');
    console.log(originalPath);
    const convertedPath = path.resolve(__dirname + '../../assets/converted');
    await sharp(`${originalPath}/${file}`)
      .resize(100, 100, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(`${convertedPath}/sm/${file}`);
    await sharp(`${originalPath}/${file}`)
      .resize(500, 500, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(`${convertedPath}/md/${file}`);
    await sharp(`${originalPath}/${file}`)
      .resize(1000, 1000, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFile(`${convertedPath}/lg/${file}`);
    fs.unlinkSync(`${originalPath}/${file}`);
  },
  async addImageToQueue() {
    let start = false;
    if (imageQueue.length == 0) {
      start = true;
    }
    imageQueue.push(product);
    if (start) {
      module.exports.downloadImages();
    }
  },
  async downloadImages(index = 0) {
    console.log(index);
    if (imageQueue.length == index) {
      imageQueue = [];
      return;
    }

    let url = imageQueue[index];

    let lastIndex =
      url.lastIndexOf('?') > -1 ? url.lastIndexOf('?') : url.length;

    let fileName = url.substring(url.lastIndexOf('/') + 1, lastIndex);

    let writer = fs.createWriteStream(
      path.resolve(__dirname + `../../assets/original${fileName}`)
    );

    let response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    writer.on('finish', () => {
      return module.exports.downloadImages(index + 1);
    });

    writer.on('error', () => {
      return module.exports.downloadImages(index + 1);
    });
  },
};
