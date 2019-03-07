'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();
var JWT_SECRET = process.env.JWT_SECRET;

var generateToken = function generateToken(id) {
  var expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '24h';
  return _jsonwebtoken2.default.sign({ id: id }, JWT_SECRET, { expiresIn: expiresIn });
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
     * @description - login a user
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
    key: 'loginUser',
    value: async function loginUser(req, res) {
      var _req$body = req.body,
          email = _req$body.email,
          password = _req$body.password,
          rememberMe = _req$body.rememberMe;

      try {
        var foundUser = await _models.User.findOne({
          where: { email: email }
        });
        if (!foundUser) {
          return res.status(404).json({
            success: false,
            errors: ['Invalid credentials']
          });
        }
        var passwordMatch = (0, _bcrypt.compareSync)(password, foundUser.password);
        if (!passwordMatch) {
          return res.status(401).json({
            success: false,
            errors: ['Invalid credentials']
          });
        }
        var expiresIn = rememberMe ? '240h' : '24h';
        try {
          var token = generateToken(foundUser.id, expiresIn);
          return res.status(200).json({
            success: true,
            message: 'Welcome ' + foundUser.username,
            token: token
          });
        } catch (err) {
          return res.status(500).json({
            sucess: false,
            errors: [err.message]
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          errors: [err.message]
        });
      }
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
              error: error.message,
              success: false
            });
          });
        }
        return res.json({
          message: 'User not found',
          success: false
        });
      });
    }
  }]);

  return UserController;
}();

exports.default = UserController;