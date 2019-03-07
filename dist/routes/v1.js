'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _profile = require('../controllers/profile');

var _profile2 = _interopRequireDefault(_profile);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

var _validation = require('../middleware/validation');

var _google = require('../auth/google');

var _google2 = _interopRequireDefault(_google);

var _facebook = require('../auth/facebook');

var _facebook2 = _interopRequireDefault(_facebook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiRoutes = _express2.default.Router();

apiRoutes.post('/user', _validation.validateSignup, _validation.returnValidationErrors, _user2.default.registerUser);

apiRoutes.get('/verify/:verificationId', _user2.default.verifyAccount);

// Profiles route

apiRoutes.get('/userprofile', _auth2.default.verifyUser, _profile2.default.viewProfile);

apiRoutes.patch('/userprofile', _auth2.default.verifyUser, _validation.validateProfileChange, _validation.returnValidationErrors, _profile2.default.editProfile);

apiRoutes.post('/user/login', _validation.validateLogin, _validation.returnValidationErrors, _user2.default.loginUser);
/* GOOGLE ROUTER */
apiRoutes.get('/auth/google', _google2.default.authenticate('google', {
  scope: ['email', 'profile']
}));

apiRoutes.get('/auth/google/callback', _google2.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
  // res.send('Yayyy it worked')
});

/* FACEBOOK ROUTER */
apiRoutes.get('/auth/facebook', _facebook2.default.authenticate('facebook', {
  scope: ['email', 'profile']
}));

apiRoutes.get('/auth/facebook/callback', _facebook2.default.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

exports.default = apiRoutes;