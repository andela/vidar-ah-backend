import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import errorhandler from 'errorhandler';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import routes from './routes/index';
import doc from './doc.json';
import CreateSuperAdmin from './seeders/createSuperAdmin';

const { registerSuperAdmin } = CreateSuperAdmin;

// read .env config
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

// configure router
app.use('/api', routes);

// api doc
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(doc));

if (!isProduction) {
  app.use(errorhandler());
}
app.get('/', (req, res) => res.status(200).json({
  message: 'Welcome to Author Haven'
}));
// / catch 404 and forward to error handler
app.all('*', (req, res) => res.status(404).json({
  error: 'Page not found.',
}));

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, res) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

registerSuperAdmin();

// finally, let's start our server...
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
