process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const url = 'localhost:5000';

describe('Order Routes', () => {
  it('Get All Orders.', (done) => {
    request(url)
      .get('/orders')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('Get fake order.', (done) => {
    request(url)
      .get('/orders/fakeid')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(404);
        expect(res.body.errors[0].message).to.be.equal('No Order Found');
        done();
      });
  });
});
