process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../services/manager-api/index');

describe('GET Customer with Wrong id', () => {
  before(function (done) {
    app.on('appStarted', function () {
      done();
    });
  });

  it('Create Customer.', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end(function (res) {
        console.log(res);
        done();
      });
  });
});
