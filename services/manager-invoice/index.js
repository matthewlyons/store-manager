const express = require("express");
const fs = require("fs-extra");
const ejs = require("ejs");
const cors = require("cors");
const bodyParser = require("body-parser");
const Moment = require("moment");
const path = require("path");
const _ = require("lodash");

// MongoDB Models
const { Order, DraftOrder } = require("../../common/models/Order");

const {
  emailInvoice,
  emailPurchaseOrder,
  processOrder,
  createPDF,
  printPDF,
} = require("./helpers");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

let helpers = {
  ConvertDate: (date) => {
    return Moment(date).format("MM/DD/YY");
  },
  getTaxPercent: (rate) => {
    return rate * 100;
  },
  getTotal: (price, quantity) => {
    return price * quantity;
  },
  properCase: (string) => {
    return _.startCase(_.toLower(string));
  },
};

app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.static(path.resolve(__dirname, "templates")));

app.set("views", path.join(__dirname, "./templates"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("order");
});

app.get("/html", async (req, res) => {
  let orderInfo = {
    products: [
      {
        vendor: {
          contactInformation: {
            contacts: [],
          },
          purchaseOrders: [],
          visible: true,
          showPricing: true,
          name: "Night & Day",
          vendorCodes: [],
          date: "2020-07-13T20:07:42.220Z",
          __v: 0,
        },
        sku: "KPQ-QEN/EKG-CH",
        price: "142",
        title: "",
        quantity: 1,
        status: "Special Order",
        color: "Cherry",
        hardware: "",
        wood: "",
        custom: true,
        notes: [],

        purchased: true,
      },
    ],
    address: {
      street: "1234 1st Street",
      city: "Vancouver",
      state: "Washington",
      zip: 98661,
    },
    delivery: false,
    itemTotal: 142,
    subTotal: 149.45,
    salesTax: 11.71,
    salesTaxRate: 0.085,
    militaryDiscount: true,
    discount: 4.26,
    deposit: 0,
    totalDue: 149.45,
    customer: {
      name: "Smith, John",
      email: [],
      addresses: [
        {
          street: "1234 1st Street",
          city: "Vancouver",
          state: "Washington",
          zip: "98661",
          comment: "",
        },
      ],
      phone: [],
      notes: [],
      orders: [
        {
          order: "6327a3f042566f10ad5518d7",
        },
      ],
      draftorders: [],
      __v: 1,
    },
    emailNotification: false,
    employee: "Henry",
    note: "",
    estimatedStoreArrival: "2",
    phone: [],
    date: "2022-09-18T23:04:16.359Z",
    __v: 0,
  };
  let Type = "order";
  let order = processOrder(orderInfo);

  let template = Type === "order" ? "order" : "quote";

  const filePath = path.resolve(__dirname, `./templates/${template}.ejs`);

  let compiled = ejs.compile(fs.readFileSync(filePath, "utf8"), {
    filename: filePath,
  });

  let html = compiled({ order, helpers });
  res.send(html);
});

app.post("/Print/:Type", async (req, res) => {
  let { Type } = req.params;

  let order = processOrder(req.body.order);

  let template = Type === "order" ? "order" : "quote";

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

  if (Type === "order") {
    let accountingCompiled = ejs.compile(
      fs.readFileSync(order_accountingPath, "utf8"),
      {
        filename: order_accountingPath,
      }
    );
    let customerCompiled = ejs.compile(
      fs.readFileSync(order_customerPath, "utf8"),
      {
        filename: order_customerPath,
      }
    );
    let storeCompiled = ejs.compile(fs.readFileSync(order_storePath, "utf8"), {
      filename: order_storePath,
    });

    finalHTML =
      (await customerCompiled({ order, helpers })) +
      (await storeCompiled({ order, helpers })) +
      (await accountingCompiled({ order, helpers }));
  } else {
    let quoteCompiled = ejs.compile(fs.readFileSync(quotePath, "utf8"), {
      filename: quotePath,
    });
    finalHTML = quoteCompiled({ order, helpers });
  }

  let type = Type === "order" ? "Invoice" : "Quote";
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, "");
  let pdf = await createPDF(finalHTML, pdfTitle);

  printPDF(`invoices/${pdf}.pdf`)
    .then((pdf) => {
      res.send("Printing...");
    })
    .catch((pdf) => {
      return res.status(500).json({
        errors: [{ message: pdf }],
      });
    });
});

app.post("/Email/:Type", async (req, res) => {
  let { Type } = req.params;
  let email = req.body.email;

  let order = processOrder(req.body.order);

  let template = Type === "order" ? "order" : "quote";

  const filePath = path.resolve(__dirname, `./templates/${template}.ejs`);

  let compiled = ejs.compile(fs.readFileSync(filePath, "utf8"), {
    filename: filePath,
  });

  let html = compiled({ order, helpers });
  let type = Type === "order" ? "Invoice" : "Quote";
  let title = `${order.customer.name} ${type}`;
  let pdfTitle = title.replace(/\W/g, "");
  let pdf = await createPDF(html, pdfTitle);

  emailInvoice(pdf, email)
    .then(() => {
      res.send("Email Sent");
    })
    .catch(() => {
      res.json({
        errors: [{ message: "Could Not Send Email" }],
      });
    });
});

const port = process.env.PORT || 5002;

app.listen(port, () => console.log(`Server running on port ${port}`));
