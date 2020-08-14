const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

const {
  configureOrder,
  configureHTML,
  emailInvoice,
  compileTemplate,
  createPDF,
  printPDF
} = require('./helpers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static(path.resolve(__dirname, 'build')));
app.use(express.static(path.resolve(__dirname, 'template')));

app.post('/pdf', async (req, res) => {
  let order = configureOrder(req.body);

  let html = await compileTemplate('order', order);
  let title = order.customer.name + ' Invoice';
  let pdf = await createPDF(html + html, title);
  printPDF(pdf)
    .then((pdf) => {
      res.send('Printing...');
    })
    .catch((pdf) => {
      return res.status(500).json({
        errors: [{ message: 'Could Not Print Invoice' }]
      });
    });
});

app.post('/Email/:Type', async (req, res) => {
  let email = req.body.email;
  let order = configureOrder(req.body.order);

  let html = await compileTemplate(req.params.Type, order);
  let type = Type === 'order' ? 'Invoice' : 'Quote';
  let title = `${order.customer.name} ${type}`;
  let pdf = await createPDF(html, title);

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

app.post('/Draft', async (req, res) => {
  let order = configureOrder(req.body);

  let html = await compileTemplate('quote', order);

  let title = order.customer.name + ' Invoice';
  let pdf = await createPDF(html, title);
  printPDF(pdf)
    .then((pdf) => {
      res.send('Printing...');
    })
    .catch((pdf) => {
      return res.status(500).json({
        errors: [{ message: 'Could Not Print Invoice' }]
      });
    });
});

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`Server running on port ${port}`));
