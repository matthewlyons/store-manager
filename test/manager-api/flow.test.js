process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const url = 'localhost:5000';

describe('Workflow Testing', () => {
  let vendorID;
  let productID;
  it('Create a Vendor', (done) => {
    request(url)
      .post('/vendor')
      .send({ name: 'Test Vendor' })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
  it('Create Duplicate Vendor', (done) => {
    request(url)
      .post('/vendor')
      .send({ name: 'Test Vendor' })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        expect(res.body.errors[0].message).to.be.equal('Vendor Already Exists');
        done();
      });
  });
  it('Get all Vendors', (done) => {
    request(url)
      .get('/vendor')
      .end((err, res) => {
        vendorID = res.body[0]._id;
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('Update a Vendor', (done) => {
    request(url)
      .put(`/vendor/${vendorID}`)
      .send({ name: 'New Test Vendor' })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body._id).to.be.equal(vendorID);
        expect(res.body.name).to.be.equal('New Test Vendor');
        done();
      });
  });
  it('Get All Products.', (done) => {
    request(url)
      .get('/products')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('Get fakeProduct.', (done) => {
    request(url)
      .get('/products/fakeid')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.errors[0].message).to.be.equal('No Product Found');
        done();
      });
  });
  it('Create a Product Without Correct Values', (done) => {
    request(url)
      .post('/products')
      .send({
        name: 'Test Product'
      })
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(400);
        let errorArray = res.body.errors.map((error) => {
          return error.message;
        });
        expect(errorArray).to.include(
          'Product Field: "compare_at_price" is required.'
        );
        expect(errorArray).to.include('Product Field: "price" is required.');
        expect(errorArray).to.include('Product Field: "sku" is required.');
        expect(errorArray).to.include('Product Field: "vendor" is required.');
        done();
      });
  });
  it('Create a Product', (done) => {
    request(url)
      .post('/products')
      .send({
        name: 'Test Product',
        sku: '1a2b3c',
        price: '450.59',
        compare_at_price: '450.59',
        vendor: vendorID
      })
      .end((err, res) => {
        productID = res.body._id;
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
  it('Delete a Product', (done) => {
    request(url)
      .delete(`/products/${productID}`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
  it('Delete a Fake Product', (done) => {
    request(url)
      .delete(`/products/fake`)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        done();
      });
  });
});
