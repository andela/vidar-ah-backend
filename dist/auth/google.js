'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth');

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _models = require('../models/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GoogleStrategy = _passportGoogleOauth2.default.OAuth2Strategy;

_passport2.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:7000/api/v1/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    _models.User.findOrCreate({ where: { email: email },
        defaults: {
            name: profile.displayName,
            username: profile.name.givenName,
            email: email
        }
    }).then(function (user) {
        return done(null, user[0].dataValues);
    });
    // .catch(error => done(error))
}));

_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
    _models.User.findByPk(id).then(function (user) {
        return done(null, user);
    }).catch(function (error) {
        return console.log(error);
    });
});

exports.default = _passport2.default;