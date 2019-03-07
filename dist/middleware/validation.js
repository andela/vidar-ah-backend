'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLogin = exports.validateProfileChange = exports.validateSignup = exports.returnValidationErrors = undefined;

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

var validateSignup = exports.validateSignup = [check('email').isEmail().withMessage('Please enter a valid email address').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the email.'), check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the password.'), check('name').isString().withMessage('Name must be alphanumeric characters.'), check('username').isAlphanumeric().withMessage('Username is should be alphamumeric, no special characters and spaces.').isLength({ min: 5, max: 15 }).withMessage('Username must be at least 5 characters long and not more than 15.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('No spaces are allowed in the username.')];

var validateProfileChange = exports.validateProfileChange = [check('firstname').isAlphanumeric().withMessage('Firstname must be alphanumeric characters, please remove leading and trailing whitespaces.'), check('lastname').isAlphanumeric().withMessage('Lastname must be alphanumeric characters, please remove leading and trailing whitespaces.'), check('bio').isString().withMessage('Bio must be alphanumeric characters, please remove leading and trailing whitespaces.')];

var validateLogin = exports.validateLogin = [check('email').isEmail().withMessage('Please provide a valid email.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('Please provide a valid email.'), check('password').isLength({ min: 6 }).withMessage('Please provide a valid password.').custom(function (value) {
  return !/\s/.test(value);
}).withMessage('Please provide a valid password.')];