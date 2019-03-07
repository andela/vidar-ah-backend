'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _emails = require('../helpers/emails');

var _emails2 = _interopRequireDefault(_emails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var HOST_URL = process.env.HOST_URL;


module.exports = function (sequelize, DataTypes) {
  var userSchema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists'
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exists'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verificationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };
  var User = sequelize.define('User', userSchema);
  User.hook('beforeValidate', function (user) {
    user.verificationId = _shortid2.default.generate();
    if (user.password) {
      user.password = _bcrypt2.default.hashSync(user.password, _bcrypt2.default.genSaltSync(10));
    }
  });
  User.hook('afterCreate', function (user) {
    var email = user.email,
        name = user.name,
        verificationId = user.verificationId;

    var emailPayload = {
      name: name,
      email: email,
      link: HOST_URL + '/api/v1/verify/' + verificationId
    };
    (0, _emails2.default)(emailPayload);
  });

  // eslint-disable-next-line func-names
  User.prototype.verifyAccount = async function () {
    this.verified = true;
    this.verificationId = null;
    await this.save();
    return this;
  };
  return User;
};