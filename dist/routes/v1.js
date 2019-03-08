'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _validation = require('../middleware/validation');

var _google = require('../auth/google');

var _google2 = _interopRequireDefault(_google);

var _facebook = require('../auth/facebook');

var _facebook2 = _interopRequireDefault(_facebook);

var _twitter = require('../auth/twitter');

var _twitter2 = _interopRequireDefault(_twitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiRoutes = _express2.default.Router();

apiRoutes.post('/user', _validation.validateSignup, _validation.returnValidationErrors, _user2.default.registerUser);

apiRoutes.get('/verify/:verificationId', _user2.default.verifyAccount);

/* GOOGLE ROUTER */
apiRoutes.get('/auth/google', _google2.default.authenticate('google', {
  scope: ['email', 'profile']
}));

apiRoutes.get('/auth/google/callback', _google2.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

/* FACEBOOK ROUTER */
apiRoutes.get('/auth/facebook', _facebook2.default.authenticate('facebook', {
  scope: ['email']
}));

apiRoutes.get('/auth/facebook/callback', _facebook2.default.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

/* TWITTER ROUTER */
apiRoutes.get('/auth/twitter', _twitter2.default.authenticate('twitter', { scope: ['email'] }));

apiRoutes.get('/auth/twitter/callback', _twitter2.default.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

exports.default = apiRoutes;