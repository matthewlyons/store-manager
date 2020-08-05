require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const convert = require('xml-js');

const { connectDB } = require('../../common/helpers');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

connectDB();

const TaxRate = require('../../common/models/TaxRate');

app.get('/', async (req, res) => {
  let rates = await TaxRate.find();

  res.json({ rates });
});

async function GetRate(street, city, zip) {
  console.log('Getting New Rate');
  let response = await axios.get(
    `http://webgis.dor.wa.gov/webapi/AddressRates.aspx?output=xml&addr=${street}&city=${city}&zip=${zip}`
  );

  // Convert XML To JSON
  let data = convert.xml2json(response.data, { compact: true, spaces: 4 });
  // Get Rate From Json
  return JSON.parse(data).response._attributes.rate;
}

app.post('/', async (req, res) => {
  let { street, city, zip } = req.body;

  let current = await TaxRate.findOne({ address: `${street} ${city} ${zip}` });

  console.log(current);

  let rate;

  if (current) {
    rate = current.rate;
  } else {
    rate = await GetRate(street, city, zip);
    let NewRate = new TaxRate({
      address: `${street} ${city} ${zip}`,
      rate,
      date: Date.now()
    });
    console.log(NewRate);
    NewRate.save();
  }
  console.log(rate);

  res.json({ rate });
});

const port = process.env.PORT || 5006;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
