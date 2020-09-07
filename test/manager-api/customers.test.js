process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../services/manager-api/index');

describe('GET Customer with Wrong id', () => {
  it('Returns error when there is no matching customer', (done) => {
    request(app)
      .get('/customers/fakeID')
      .then((res) => {
        console.log(res);
        done();
      })
      .catch((err) => done(err));
  });
});
