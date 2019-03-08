'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _errorhandler = require('errorhandler');

var _errorhandler2 = _interopRequireDefault(_errorhandler);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _doc = require('./doc.json');

var _doc2 = _interopRequireDefault(_doc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// read .env config
_dotenv2.default.config();
var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = (0, _express2.default)();

app.use((0, _cors2.default)());

// Normal express config defaults
app.use((0, _morgan2.default)('combined'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  secret: 'team vidar',
  key: 'vidar',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000,
    expires: false
  }
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

// configure router
app.use('/api', _index2.default);

// api doc
app.use('/api-docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_doc2.default));

if (!isProduction) {
  app.use((0, _errorhandler2.default)());
}
app.get('/', function (req, res) {
  return res.status(200).json({
    message: 'Welcome to Author Haven'
  });
});
// / catch 404 and forward to error handler
app.all('*', function (req, res) {
  return res.status(404).json({
    error: 'Page not found.'
  });
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, res) {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, res) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
app.listen(process.env.PORT, function () {
  // eslint-disable-next-line no-console
  console.log('Listening on port ' + process.env.PORT);
});

exports.default = app;