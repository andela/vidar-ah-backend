'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import sendMail from '../helpers/emails';

_dotenv2.default.config();
var JWT_SECRET = process.env.JWT_SECRET;

var generateToken = function generateToken(id) {
  return _jsonwebtoken2.default.sign({ id: id }, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * @class UserController
 *  @override
 * @export
 *
 */

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: 'registerUser',

    /**
       * @description - Creates a new user
       * @static
       *
       * @param {object} req - HTTP Request
       * @param {object} res - HTTP Response
       *
       * @memberof UserController
       *
       * @returns {object} Class instance
       */
    value: function registerUser(req, res) {
      var body = req.body;

      _models.User.create(body).then(function (newUser) {
        var id = newUser.dataValues.id;

        var token = generateToken(id);
        return res.status(201).json({
          success: true,
          message: 'You have signed up successfully.',
          token: token
        });
      }).catch(function (error) {
        var errors = [];
        if (error.errors[0].path === 'username') {
          errors.push(error.errors[0].message);
        }
        if (error.errors[0].path === 'email') {
          errors.push(error.errors[0].message);
        }
        return res.status(409).json({
          success: false,
          errors: errors
        });
      });
    }

    /**
       * @description - Verifies a user's account
       * @static
       *
       * @param {object} req - HTTP Request
       * @param {object} res - HTTP Response
       *
       * @memberof UserController
       *
       * @returns {object} Class instance
       */

  }, {
    key: 'verifyAccount',
    value: function verifyAccount(req, res) {
      var verificationId = req.params.verificationId;

      _models.User.findOne({
        where: { verificationId: verificationId }
      }).then(function (foundUser) {
        if (foundUser) {
          return foundUser.verifyAccount().then(function () {
            return res.status(200).json({
              success: true,
              message: 'Account verified successfully.'
            });
          }).catch(function (error) {
            return res.json({
              success: false,
              message: error.message
            });
          });
        }
        return res.json({
          success: false,
          message: 'User not found'
        });
      });
    }
  }]);

  return UserController;
}();

exports.default = UserController;