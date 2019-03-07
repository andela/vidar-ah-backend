'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var _process$env = process.env,
    EMAIL_PASSWORD = _process$env.EMAIL_PASSWORD,
    EMAIL_ADDRESS = _process$env.EMAIL_ADDRESS;


var transporter = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD
  }
});

var sendMail = function sendMail(payload) {
  var email = payload.email,
      name = payload.name,
      link = payload.link;

  var mailOptions = {
    from: EMAIL_ADDRESS,
    to: email,
    subject: 'Welcome to Authors Haven',
    html: '<h1>Hi ' + name + '</h1>\n      <p>Please click <a href="' + link + '">here</a> to verify your account.</p>\n    '
  };
  return transporter.sendMail(mailOptions);
};

exports.default = sendMail;