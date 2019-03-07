'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _models = require('../models');

var _splitName = require('../helpers/splitName');

var _splitName2 = _interopRequireDefault(_splitName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import sendMail from '../helpers/emails';

/**
 * @class ProfileController
 *  @override
 * @export
 *
 */
var ProfileController = function () {
  function ProfileController() {
    _classCallCheck(this, ProfileController);
  }

  _createClass(ProfileController, null, [{
    key: 'viewProfile',

    /**
       * @description - Renders a user's profile
       * @static
       *
       * @param {object} req - HTTP Request
       * @param {object} res - HTTP Response
       *
       * @memberof ProfileController
       *
       * @returns {object} User Profile
       */
    value: async function viewProfile(req, res) {
      var id = req.user.id;


      try {
        var foundUser = await _models.User.findOne({
          raw: true,
          where: {
            id: id
          }
        });
        delete foundUser.password;
        delete foundUser.verificationId;

        var splitNamesObject = (0, _splitName2.default)(foundUser);

        return res.status(200).json({
          success: true,
          body: _underscore2.default.extendOwn(foundUser, splitNamesObject)
        });
      } catch (error) {
        return res.status(409).json({
          success: false,
          errors: [error.message]
        });
      }
    }

    /**
     * @description - updates user's profile
     * @static
     *
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     *
     * @memberof ProfileController
     *
     * @returns {object} User Profile
     */

  }, {
    key: 'editProfile',
    value: async function editProfile(req, res) {
      var id = req.user.id;


      try {
        var updateResult = await _models.User.update({ bio: req.body.bio, name: req.body.firstname + ' ' + req.body.lastname }, {
          returning: true,
          raw: true,
          where: {
            id: id
          }
        });

        var updatedProfile = updateResult[1][0];

        delete updatedProfile.password;
        delete updatedProfile.verificationId;

        var splitNamesObject = (0, _splitName2.default)(updatedProfile);

        return res.status(205).json({
          success: true,
          body: _underscore2.default.extendOwn(updatedProfile, splitNamesObject)
        });
      } catch (error) {
        return res.status(409).json({
          success: false,
          errors: [error.message]
        });
      }
    }
  }]);

  return ProfileController;
}();

exports.default = ProfileController;