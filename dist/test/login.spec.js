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


var newUser = {
  email: 'testing123559@gmail.com',
  password: 'testing',
  name: 'testing testing',
  username: 'testing123559'
};

var validUser = {
  email: 'testing123559@gmail.com',
  password: 'testing'
};

describe('User login authentication: ', function () {
  before(function (done) {
    _chai2.default.request(_index2.default).post('/api/v1/user').send(newUser).end(function (err) {
      done(err);
    });
  });

  describe('Make a request with valid credentials', function () {
    it('Returns a success message with status 200', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').send(validUser).end(function (err, res) {
        var status = res.status,
            _res$body = res.body,
            success = _res$body.success,
            message = _res$body.message;

        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Welcome testing123559');
        done(err);
      });
    });
  });

  describe('Make a request without email and password', function () {
    it('Returns 422 error', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').end(function (err, res) {
        var status = res.status,
            _res$body2 = res.body,
            success = _res$body2.success,
            errors = _res$body2.errors;

        expect(status).to.be.equal(422);
        expect(errors).to.be.an('Array');
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Please provide a valid email.');
        expect(errors[1]).to.be.equal('Please provide a valid password.');
        done(err);
      });
    });
  });

  describe('Make a request without email', function () {
    it('Returns an error message with status 422', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').send({ password: _faker2.default.internet.password() }).end(function (err, res) {
        var status = res.status,
            _res$body3 = res.body,
            success = _res$body3.success,
            errors = _res$body3.errors;

        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Please provide a valid email.');
        done(err);
      });
    });
  });

  describe('Make a request without password', function () {
    it('Returns an error message with status 422', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').send({ email: _faker2.default.internet.email() }).end(function (err, res) {
        var status = res.status,
            _res$body4 = res.body,
            success = _res$body4.success,
            errors = _res$body4.errors;

        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Please provide a valid password.');
        done(err);
      });
    });
  });

  describe('Make a request with invalid email', function () {
    it('Returns an error message with status 404', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').send({
        email: 'nonexistinguser@gmail.com',
        password: 'testing'
      }).end(function (err, res) {
        var status = res.status,
            _res$body5 = res.body,
            success = _res$body5.success,
            errors = _res$body5.errors;

        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Invalid credentials');
        done(err);
      });
    });
  });

  describe('Make a request with invalid password', function () {
    it('Returns an error message with status 401', function (done) {
      _chai2.default.request(_index2.default).post('/api/v1/user/login').send({
        email: 'testing123559@gmail.com',
        password: 'incorrectPassword'
      }).end(function (err, res) {
        var status = res.status,
            _res$body6 = res.body,
            success = _res$body6.success,
            errors = _res$body6.errors;

        expect(status).to.be.equal(401);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Invalid credentials');
        done(err);
      });
    });
  });
});