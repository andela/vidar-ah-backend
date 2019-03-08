'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportFacebook.Strategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'https://vidar-ah-backend-staging.herokuapp.com/api/v1/auth/facebook/callback'
},
/**
   * callback function for facebook strategy
   * @param {object} accessToken authorization token
   * @param  {object} refreshToken authorization token
   * @param  {object} profile a user profile
   * @param {function} done end of function
   * @returns {function} callback
   */
function (accessToken, refreshToken, profile, done) {
  done(null, profile);
}));

exports.default = _passport2.default;