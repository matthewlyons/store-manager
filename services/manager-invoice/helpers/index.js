require('dotenv').config();

const hbs = require('hbs');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const _ = require('underscore');
const fs = require('fs-extra');
const path = require('path');
const printer = require('pdf-to-printer');
const puppeteer = require('puppeteer');
const { dirname } = require('path');
const Moment = require('moment');

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ConvertDate', function (date) {
  return Moment(date).format('MM/DD/YY');
});
hbs.registerHelper('getTotal', function (arg1, arg2) {
  return arg1 * arg2;
});
hbs.registerHelper('getTaxPercent', function (arg1) {
  return arg1 * 100;
});

hbs.registerPartials(path.resolve(__dirname + '/../templates/partials/'));

const mailerConfig = {
  host: 'smtp.office365.com',
  secureConnection: true,
  port: 587,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
};

module.exports = {
  configureOrder(order) {
    let products = _.chunk(order.products.reverse(), 8);
    order.pages = products.reverse().map((list, i) => {
      return { index: i + 1, products: list };
    });
    order.pagesLength = products.length;
    delete order.products;
    return order;
  },
  configureHTML(html, type) {
    switch (type) {
      case 'order':
        return html + html;
        break;
      case 'quote':
        return html;
        break;
      default:
        break;
    }
  },
  async compileEJS(template, data) {
    console.log('Running');
    const filePath = path.resolve(
      __dirname,
      '..' + `/ejstemplates/${template}.ejs`
    );
    let compiled = ejs.compile(fs.readFileSync(filePath, 'utf8'));
    let html = compiled({ data });
    console.log(html);
  },
  async compileTemplate(template, data) {
    const filePath = path.resolve(
      __dirname,
      '..' + `/templates/${template}.handlebars`
    );
    const html = await fs.readFile(filePath, 'utf-8');

    const compiled = await hbs.compile(html)(data);
    return compiled;
  },
  async emailInvoice(file, email) {
    console.log('Sending Email');
    console.log(mailerConfig);
    let transporter = nodemailer.createTransport(mailerConfig);
    let filePath = path.resolve(__dirname, '..', `invoices/${file}.pdf`);
    let mailOptions = {
      from: 'Vancouver Woodworks <sales@vancouverwoodworks.com>',
      to: email,
      subject: 'Thank you for your order!',
      html:
        '<body><p>Please let me know if you have questions.</p><p></p><p>Have a great day!</p></body>',
      attachments: [
        {
          filename: `${file}.pdf`,
          path: filePath,
          contentType: 'application/pdf'
        }
      ]
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error) {
        if (error) {
          console.log(error);
          fs.unlinkSync(filePath);
          reject(error);
        } else {
          fs.unlinkSync(filePath);
          resolve('Success');
        }
      });
    });
  },
  async printPDF(file) {
    return new Promise((resolve, reject) => {
      let filePath = path.resolve(__dirname, '..', `invoices/${file}.pdf`);
      printer
        .print(filePath)
        .then((data) => {
          console.log(data);
          fs.unlinkSync(filePath);
          resolve('Success');
        })
        .catch((err) => {
          console.log(err);
          reject('Failure');
        });
    });
  },
  async createPDF(html, title) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html);
      await page.emulateMedia('screen');

      await page.pdf({
        path: path.resolve(__dirname, '..' + `/invoices/${title}.pdf`),
        format: 'letter'
      });
      console.log('done');
      await browser.close();
      process.exit;
      return title;
    } catch (e) {
      console.log(e);
    }
  }
};
