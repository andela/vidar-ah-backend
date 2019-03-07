'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure chai
_chai2.default.use(_chaiHttp2.default); // Require the dependencies
var expect = _chai2.default.expect;

// Keep Token

var userToken = void 0;

var validUser = {
  username: 'JamesBond',
  email: 'jamesbondxxc@gmail.com',
  name: 'James Bond',
  password: '1234567'
};

var profileDetails = {
  firstname: 'NewFirstName',
  lastname: 'NewLastName',
  bio: 'I love playing basketball'
};

describe('Make a request to signup with valid details', function () {
  it('Returns successfully signed up message', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send(validUser).end(function (err, res) {
      var status = res.status,
          _res$body = res.body,
          message = _res$body.message,
          success = _res$body.success,
          token = _res$body.token;

      userToken = token;
      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('You have signed up successfully.');
      done(err);
    });
  });
});

describe('View default profile details', function () {
  it('Returns default profile details', function (done) {
    _chai2.default.request(_index2.default).get('/api/v1/userprofile').set('x-access-token', userToken).end(function (err, res) {
      var status = res.status,
          _res$body2 = res.body,
          success = _res$body2.success,
          body = _res$body2.body;

      expect(status).to.be.equal(200);
      expect(success).to.be.equal(true);
      expect(body).to.be.a('Object');
      expect(body.username).to.have.string('JamesBond');
      expect(body.email).to.have.string('jamesbondxxc@gmail.com');
      expect(body.name).to.have.string('James');
      done(err);
    });
  });
});

describe('Update profile details', function () {
  it('Returns successfully profile details', function (done) {
    _chai2.default.request(_index2.default).patch('/api/v1/userprofile').set('x-access-token', userToken).send(profileDetails).end(function (err, res) {
      var status = res.status,
          _res$body3 = res.body,
          success = _res$body3.success,
          body = _res$body3.body;

      expect(status).to.be.equal(205);
      expect(success).to.be.equal(true);
      expect(body).to.be.a('Object');
      expect(body.username).to.have.string('JamesBond');
      expect(body.email).to.have.string('jamesbondxxc@gmail.com');
      expect(body.name).to.have.string('NewFirstName');
      expect(body.bio).to.have.string('basketball');
      done(err);
    });
  });
});

describe('View updated profile details', function () {
  it('Returns updated profile details', function (done) {
    _chai2.default.request(_index2.default).get('/api/v1/userprofile').set('x-access-token', userToken).end(function (err, res) {
      var status = res.status,
          _res$body4 = res.body,
          success = _res$body4.success,
          body = _res$body4.body;

      expect(status).to.be.equal(200);
      expect(success).to.be.equal(true);
      expect(body).to.be.a('Object');
      expect(body.username).to.have.string('JamesBond');
      expect(body.email).to.have.string('jamesbondxxc@gmail.com');
      expect(body.name).to.have.string('NewFirstName');
      expect(body.bio).to.have.string('basketball');
      done(err);
    });
  });
});