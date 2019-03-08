'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure chai
// Require the dependencies
_chai2.default.use(_chaiHttp2.default);
var expect = _chai2.default.expect;


var validUser = {
  username: 'flippin',
  email: 'flipping2234@gmail.com',
  name: 'Flipping James',
  password: '1234567'
};

describe('Make a request to an unidentified route', function () {
  it('Returns 404 error', function (done) {
    _chai2.default.request(_index2.default).get('/wrong-url').end(function (err, res) {
      var status = res.status,
          error = res.body.error;

      expect(status).to.be.equal(404);
      expect(error).to.be.equal('Page not found.');
      done(err);
    });
  });
});

describe('Make a request to signup with valid details', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send(validUser).end(function (err, res) {
      var status = res.status,
          _res$body = res.body,
          message = _res$body.message,
          success = _res$body.success;

      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('You have signed up successfully.');
      done(err);
    });
  });
});

describe('Make a request to signup with empty signup fields', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').end(function (err, res) {
      var status = res.status,
          _res$body2 = res.body,
          errors = _res$body2.errors,
          success = _res$body2.success;

      expect(status).to.be.equal(422);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Email is invalid.');
      expect(errors[1]).to.be.equal('Password must be at least 6 characters long.');
      expect(errors[2]).to.be.equal('Name must be alphanumeric characters.');
      expect(errors[3]).to.be.equal('Username is invalid.');
      expect(errors[4]).to.be.equal('Username must be at least 5 characters long and not more than 15.');
      done(err);
    });
  });
});

describe('Make a request to signup with an empty username', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send({
      email: _faker2.default.internet.email(),
      name: _faker2.default.name.findName(),
      password: _faker2.default.internet.password()
    }).end(function (err, res) {
      var status = res.status,
          _res$body3 = res.body,
          errors = _res$body3.errors,
          success = _res$body3.success;

      expect(status).to.be.equal(422);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Username is invalid.');
      expect(errors[1]).to.be.equal('Username must be at least 5 characters long and not more than 15.');
      done(err);
    });
  });
});

describe('Make a request to signup with an empty email', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send({
      username: _faker2.default.internet.userName(),
      name: _faker2.default.name.findName(),
      password: _faker2.default.internet.password()
    }).end(function (err, res) {
      var status = res.status,
          _res$body4 = res.body,
          errors = _res$body4.errors,
          success = _res$body4.success;

      expect(status).to.be.equal(422);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Email is invalid.');
      done(err);
    });
  });
});

describe('Make a request to signup with an empty name', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send({
      username: _faker2.default.internet.userName(),
      email: _faker2.default.internet.email(),
      password: _faker2.default.internet.password()
    }).end(function (err, res) {
      var status = res.status,
          _res$body5 = res.body,
          errors = _res$body5.errors,
          success = _res$body5.success;

      expect(status).to.be.equal(422);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Name must be alphanumeric characters.');
      done(err);
    });
  });
});

describe('Make a request to signup with an empty password', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send({
      username: _faker2.default.internet.userName(),
      email: _faker2.default.internet.email(),
      name: _faker2.default.name.findName()
    }).end(function (err, res) {
      var status = res.status,
          _res$body6 = res.body,
          errors = _res$body6.errors,
          success = _res$body6.success;

      expect(status).to.be.equal(422);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Password must be at least 6 characters long.');
      done(err);
    });
  });
});

describe('Make a request to signup with existing email', function () {
  it('Returns an invalid error.', function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send(validUser).end(function (err, res) {
      var status = res.status,
          _res$body7 = res.body,
          errors = _res$body7.errors,
          success = _res$body7.success;

      expect(status).to.be.equal(409);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Email already exists');
      done(err);
    });
  });
});

describe('Make a request to signup with existing username', function () {
  it('Returns an invalid error.', function (done) {
    var username = validUser.username;

    _chai2.default.request(_index2.default).post('/api/v1/user').send({
      email: _faker2.default.internet.email(),
      password: _faker2.default.internet.password(),
      name: _faker2.default.name.findName(),
      username: username
    }).end(function (err, res) {
      var status = res.status,
          _res$body8 = res.body,
          errors = _res$body8.errors,
          success = _res$body8.success;

      expect(status).to.be.equal(409);
      expect(success).to.be.equal(false);
      expect(errors).to.be.an('Array');
      expect(errors[0]).to.be.equal('Username already exists');
      done(err);
    });
  });
});