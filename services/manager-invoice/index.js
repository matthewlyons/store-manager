const express = require('express');
const fs = require('fs-extra');
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const Moment = require('moment');
const path = require('path');
const _ = require('lodash');

const {
  configureHTML,
  emailInvoice,
  processOrder,
  createPDF,
  printPDF
} = require('./helpers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

let helpers = {
  ConvertDate: (date) => {
    return Moment(date).format('MM/DD/YY');
  },
  getTaxPercent: (rate) => {
    return rate * 100;
  },
  getTotal: (price, quantity) => {
    return price * quantity;
  },
  properCase: (string) => {
    return _.startCase(_.toLower(string));
  }
};

app.use(express.static(path.resolve(__dirname, 'build')));
app.use(express.static(path.resolve(__dirname, 'templates')));

app.set('views', path.join(__dirname, './templates'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  res.render('order');
});
app.post('/Print/:Type', async (req, res) => {
  let { Type } = req.params;

  let order = processOrder(req.body.order);

  let template = Type === 'order' ? 'order' : 'quote';

  const filePath = path.resolve(__dirname, `./templates/${template}.ejs`);
  let compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'), {
    filename: filePath
  });
  let html = compiled({ order, helpers });

  if (process.env.NODE_ENV !== 'production') {
    fs.writeFile('invoice.html', html, function (err) {
      console.log('HTML Saved');
    });
  }

  let printHTML = configureHTML(html, template);
  let type = Type === 'order' ? 'Invoice' : 'Quote';
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, '');
  let pdf = await createPDF(printHTML, pdfTitle);
  if (process.env.NODE_ENV === 'production') {
    printPDF(pdf)
      .then((pdf) => {
        res.send('Printing...');
      })
      .catch((pdf) => {
        return res.status(500).json({
          errors: [{ message: 'Could Not Print Invoice' }]
        });
      });
  } else {
    res.send('Printing...');
  }
});

app.post('/Email/:Type', async (req, res) => {
  let { Type } = req.params;
  let email = req.body.email;
  let order = processOrder(req.body.order);

  let template = Type === 'order' ? 'order' : 'quote';

  const filePath = path.resolve(__dirname, `./templates/${template}.ejs`);
  let compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'), {
    filename: filePath
  });
  let html = compiled({ order, helpers });
  let type = Type === 'order' ? 'Invoice' : 'Quote';
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, '');
  let pdf = await createPDF(html, pdfTitle);

  emailInvoice(pdf, email)
    .then(() => {
      res.send('Email Sent');
    })
    .catch(() => {
      res.json({
        errors: [{ message: 'Could Not Send Email' }]
      });
    });
});

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`Server running on port ${port}`));
