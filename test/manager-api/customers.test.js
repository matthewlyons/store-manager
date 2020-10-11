process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../services/manager-api/index');

describe('Order Routes', () => {
  it('Get All Orders.', (done) => {
    request(app.app)
      .get('/orders')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
