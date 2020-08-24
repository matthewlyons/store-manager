const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

const {
  configureHTML,
  configureOrder,
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

app.post('/Print/:Type', async (req, res) => {
  let { Type } = req.params;
  console.log(req.body.order);
  let order = configureOrder(req.body.order);

  let template = Type === 'order' ? 'order' : 'quote';
  let html = await compileTemplate(template, order);
  let printHTML = configureHTML(html, template);
  let type = Type === 'order' ? 'Invoice' : 'Quote';
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, '');
  let pdf = await createPDF(printHTML, pdfTitle);
  res.send('Done');

  // printPDF(pdf)
  //   .then((pdf) => {
  //     res.send('Printing...');
  //   })
  //   .catch((pdf) => {
  //     return res.status(500).json({
  //       errors: [{ message: 'Could Not Print Invoice' }]
  //     });
  //   });
});

app.post('/Email/:Type', async (req, res) => {
  let { Type } = req.params;
  let email = req.body.email;
  let order = configureOrder(req.body.order);
  let template = Type === 'order' ? 'order' : 'quote';
  let html = await compileTemplate(template, order);
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
