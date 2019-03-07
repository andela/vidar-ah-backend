'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _models = require('../models/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FacebookStrategy = _passportFacebook2.default.Strategy;

_passport2.default.use(new FacebookStrategy({
  clientID: "998262500369173",
  clientSecret: "3f1b0303b9d5c13d1c1a809e43d15ced",
  callbackURL: "http://localhost:7000/api/v1/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done) {
  console.log(profile);
}));

exports.default = _passport2.default;