'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenv2.default.config();
var JWT_SECRET = process.env.JWT_SECRET;
/**
 * Authentication class
 */

var Auth = function () {
  function Auth() {
    _classCallCheck(this, Auth);
  }

  _createClass(Auth, null, [{
    key: 'verifyUser',

    /**
     * @description Middleware function to verify if user has a valid token
     * @param {object} req http request object
     * @param {object} res http response object
     * @param {Function} next next middleware function
     * @returns {undefined}
     */
    value: function verifyUser(req, res, next) {
      var token = req.headers['x-access-token'] || req.body.token || req.query.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided.'
        });
      }
      _jsonwebtoken2.default.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
          return res.status(401).json({
            success: false,
            body: err,
            message: 'Failed to authenticate token.'
          });
        }
        req.user = decoded;
        next();
      });
    }
  }]);

  return Auth;
}();

exports.default = Auth;