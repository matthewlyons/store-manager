const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connectDB } = require('../../common/helpers');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

connectDB();

const Product = require('../../common/models/Product');
const Customer = require('../../common/models/Customer');

app.get('/', (req, res) => {
  res.send('Hello from Bulk Product Routes');
});

app.post('/Pricing', (req, res) => {
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let errors = 0;

  let { Create, Update, Delete } = req.body;

  function updateProducts(i = 0) {
    if (i > Update.length - 1) {
      return createProducts();
    }
    let product = Update[i];
    Product.findOneAndUpdate({ sku: product.sku }, { $set: { ...product } })
      .then((result) => {
        updated++;
        return updateProducts(i + 1);
      })
      .catch((err) => {
        errors++;
        return updateProducts(i + 1);
      });
  }

  function createProducts(i = 0) {
    if (i > Create.length - 1) {
      return deleteProducts();
    }
    let product = Create[i];
    let dbProduct = new Product(product);
    dbProduct
      .save()
      .then((product) => {
        created++;
        return createProducts(i + 1);
      })
      .catch((err) => {
        errors++;
        return createProducts(i + 1);
      });
  }

  function deleteProducts(i = 0) {
    if (i > Delete.length - 1) {
      return done();
    }
    let product = Delete[i];
    Product.findByIdAndDelete(product._id)
      .then((res) => {
        deleted++;
        return deleteProducts(i + 1);
      })
      .catch((err) => {
        errors++;
        return deleteProducts(i + 1);
      });
  }

  function done() {
    return res.send(
      `${created} Products Created, ${updated} Products Updated, ${deleted} Products Deleted, ${errors} Errors Occurred`
    );
  }
  updateProducts();
});

// Bulk Create Customers
app.post('/Customers', (req, res) => {
  let created = 0;

  let { customers } = req.body;

  customers.forEach((customer) => {
    created++;
    let dbCustomer = new Customer(customer);
    let error = dbCustomer.validateSync();
    if (error) {
      console.log(error);
    } else {
      dbCustomer.save();
      console.log(`Creating Customer`);
    }
  });

  res.send(`${created} Customers Created.`);
});

app.post('/Data', (req, res) => {
  let { Products } = req.body;
  let updated = 0;
  Products.forEach((product) => {
    Product.findOneAndUpdate(
      { sku: product.sku },
      { $set: product },
      (err, doc) => {
        if (err) {
          console.log('Something wrong when updating data!');
        }

        console.log(doc);
      }
    );
  });
  res.json({ success: true, updated });
});

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));
