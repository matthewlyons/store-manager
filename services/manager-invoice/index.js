const express = require('express');
const fs = require('fs-extra');
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
const Moment = require('moment');
const path = require('path');
const _ = require('lodash');

// MongoDB Models
const { Order, DraftOrder } = require('../../common/models/Order');

const {
  emailInvoice,
  emailPurchaseOrder,
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

  const quotePath = path.resolve(__dirname, `./templates/quote.ejs`);
  const order_accountingPath = path.resolve(
    __dirname,
    `./templates/order_accounting.ejs`
  );
  const order_customerPath = path.resolve(
    __dirname,
    `./templates/order_customer.ejs`
  );
  const order_storePath = path.resolve(
    __dirname,
    `./templates/order_store.ejs`
  );
  let finalHTML;

  if (Type === 'order') {
    let accountingCompiled = ejs.compile(
      fs.readFileSync(order_accountingPath, 'utf8'),
      {
        filename: order_accountingPath
      }
    );
    let customerCompiled = ejs.compile(
      fs.readFileSync(order_customerPath, 'utf8'),
      {
        filename: order_customerPath
      }
    );
    let storeCompiled = ejs.compile(fs.readFileSync(order_storePath, 'utf8'), {
      filename: order_storePath
    });

    finalHTML =
      (await customerCompiled({ order, helpers })) +
      (await storeCompiled({ order, helpers })) +
      (await accountingCompiled({ order, helpers }));
  } else {
    let quoteCompiled = ejs.compile(fs.readFileSync(quotePath, 'utf8'), {
      filename: quotePath
    });
    finalHTML = quoteCompiled({ order, helpers });
  }

  if (process.env.NODE_ENV !== 'production') {
    fs.writeFile('invoice.html', finalHTML, function (err) {
      console.log('HTML Saved');
    });
  }

  let type = Type === 'order' ? 'Invoice' : 'Quote';
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, '');
  let pdf = await createPDF(finalHTML, pdfTitle);

  if (process.env.NODE_ENV === 'production') {
    printPDF(`invoices/${pdf}.pdf`)
      .then((pdf) => {
        res.send('Printing...');
      })
      .catch((pdf) => {
        return res.status(500).json({
          errors: [{ message: pdf }]
        });
      });
  } else {
    res.send('Printing...');
  }
});

app.post('/Email/:Type', async (req, res) => {
  let { Type } = req.params;
  let email = req.body.email;

  let dbOrder;

  if (Type === 'order') {
    dbOrder = await Order.findById(req.body.order._id);
  } else {
    dbOrder = await DraftOrder.findById(req.body.order._id);
  }

  if (!dbOrder.emailNotification) {
    dbOrder.emailNotification = true;
    dbOrder.save();
  }

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
