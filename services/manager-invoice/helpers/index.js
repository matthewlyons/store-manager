require('dotenv').config();

const nodemailer = require('nodemailer');
const fs = require('fs-extra');
const path = require('path');
const printer = require('pdf-to-printer');
const puppeteer = require('puppeteer');

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
  processOrder(order) {
    let pages = [];

    let productList = order.products.map((product) => {
      let notes = product.notes.length * 16;
      if (product.hardware !== '') {
        notes = notes + 16;
      }
      if (product.wood !== '') {
        notes = notes + 16;
      }
      let total = notes + 28 + 10;
      return { ...product, pixels: total };
    });

    function chunkPages(i = 0, arr = [], currentTotal = 0) {
      let totalPixels = 352;
      if (pages.length > 0) {
        totalPixels = 700;
      }
      arr.push(productList[i]);
      let newTotal = currentTotal + productList[i].pixels;
      if (i >= productList.length - 1) {
        pages.unshift(arr);
        return { ...order, pages };
      }
      if (newTotal + productList[i + 1].pixels > totalPixels) {
        pages.unshift(arr);

        return chunkPages(i + 1, [], 0);
      } else {
        return chunkPages(i + 1, arr, newTotal);
      }
    }
    return chunkPages();
  },

  async emailInvoice(file, email) {
    let transporter = nodemailer.createTransport(mailerConfig);
    let filePath = path.resolve(__dirname, '..', `invoices/${file}.pdf`);
    let mailOptions = {
      from: 'Vancouver Woodworks <sales@vancouverwoodworks.com>',
      to: email,
      subject: 'Thank you for your order!',
      html: '<body><p>Please let me know if you have questions.</p><p></p><p>Have a great day!</p></body>',
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
  async emailPurchaseOrder(file, email) {
    let transporter = nodemailer.createTransport(mailerConfig);
    let filePath = path.resolve(__dirname, '..', `invoices/${file}.pdf`);
    let mailOptions = {
      from: 'Vancouver Woodworks <sales@vancouverwoodworks.com>',
      to: email,
      subject: 'Vancouver Woodworks Purchase Order',
      html: '<body><p>Please let me know if you have questions.</p><p></p><p>Have a great day!</p></body>',
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
      let filePath = path.resolve(__dirname, '..', file);
      printer
        .print(filePath)
        .then((data) => {
          fs.unlinkSync(filePath);
          resolve('Success');
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async createPDF(html, title) {
    try {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();

      await page.setContent(html);
      await page.emulateMediaType('screen');

      await page.pdf({
        path: path.resolve(__dirname, '..' + `/invoices/${title}.pdf`),
        format: 'letter'
      });
      console.log('Created Page');
      await browser.close();
      process.exit;
      return title;
    } catch (e) {
      console.log('Handlebars Error');
      console.log(e);
    }
  }
};
