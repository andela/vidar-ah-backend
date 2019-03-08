'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth');

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportGoogleOauth.OAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:7000/api/v1/auth/google/callback'
},
/**
   * callback function for google strategy
   * @param {object} accessToken authorization token
   * @param  {object} refreshToken authorization token
   * @param  {object} profile a user profile
   * @param {function} done end of function
   * @returns {function} callback
   */
async function (accessToken, refreshToken, profile, done) {
  var email = profile.emails[0].value;
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} createOrFindUser
   */
  var user = await _models.User.findOrCreate({
    where: { email: email },
    defaults: {
      name: profile.displayName,
      username: profile.name.givenName,
      email: email
    }
  });
  console.log(user[0].dataValues);
  return done(null, user[0].dataValues);
}));

/**
   * @description - set the user id
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} user id
   */
_passport2.default.serializeUser(function (user, done) {
  done(null, user.id);
});

/**
   * @description - finds the user by id
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} user profile
   */
_passport2.default.deserializeUser(async function (id, done) {
  var user = await _models.User.findByPk(id);
  return done(null, user);
});

exports.default = _passport2.default;