require('dotenv').config();

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const urls = require('./urls.json');

const collectionRoute = path.join(
  __dirname,
  '/services/touchscreen-client/client/src/data/'
);

console.log(collectionRoute)

function checkValid(str) {
  try {
    let json = JSON.parse(str);
    console.log(json.length);
    if (json.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function getInfo(i = 0) {
  if (i + 1 > urls.length) return done();
  let url = urls[i];
  axios
    .get(`${process.env.WEBSITE_URL}${url.link}?view=json`)
    .then((collection) => {
      console.log('Got The Data For: ' + url.title);
      let jsonString = JSON.stringify(collection.data);
      let valid = checkValid(jsonString);
      if (valid) {
        console.log('Valid');
      }
      fs.writeFileSync(collectionRoute + url.title + '.json', jsonString);
      setTimeout(() => {
        return getInfo(i + 1);
      }, 5000);
    }).catch((err)=>{
      console.log(err)
    });
}

function done() {
  console.log('Done');
}

getInfo();
