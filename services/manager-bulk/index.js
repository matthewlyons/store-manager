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

app.get('/', (req, res) => {
  res.send('Hello from Bulk Product Routes');
});

app.post('/upload', (req, res) => {
  res.send('Updating');
  console.log('Updating');
  let { Create, Update, Delete } = req.body;

  deleteProducts(Delete);

  // Update Outdated Products
  Update.forEach((product) => {
    Product.findOneAndUpdate({ _id: product._id }, { ...product });
  });

  Create.forEach((product) => {
    let newProduct = new Product(product);
    newProduct.save();
  });

  function deleteProducts(products, index = 0) {
    if (products.length == index) return;
    Product.deleteOne({ _id: products[index]._id }).then((product) => {
      return deleteProducts(products, index + 1);
    });
  }
});

app.post('/Pricing', (req, res) => {
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let { Create, Update, Delete } = req.body;
  Create.forEach((product) => {
    created++;
    let dbProduct = new Product(product);
    dbProduct.save();
    console.log(`Creating: ${product.sku}`);
  });

  // Update.forEach((product) => {
  //   created++;
  //   let dbProduct = new Product(product);
  //   dbProduct.save();
  //   console.log(`Updating: ${product.sku}`);
  // });

  Delete.forEach((product) => {
    deleted++;
    console.log(`Deleting: ${product._id}`);
    Product.findByIdAndDelete(product._id)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });
  res.json({ success: true, created, updated, deleted });
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
