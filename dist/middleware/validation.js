'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSignup = exports.returnValidationErrors = undefined;

var _check = require('express-validator/check');

var _check2 = _interopRequireDefault(_check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var check = _check2.default.check,
    validationResult = _check2.default.validationResult;
var returnValidationErrors = exports.returnValidationErrors = function returnValidationErrors(req, res, next) {
  var errors = validationResult(req).array().map(function (error) {
    return error.msg;
  });
  if (!errors.length) return next();
  return res.status(422).json({ errors: errors, success: false });
};

var validateSignup = exports.validateSignup = [check('email').isEmail().withMessage('Email is invalid.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the email.'), check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the password.'), check('name').isString().withMessage('Name must be alphanumeric characters.'), check('username').isAlphanumeric().withMessage('Username is invalid.').isLength({ min: 5, max: 15 }).withMessage('Username must be at least 5 characters long and not more than 15.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the username.')];