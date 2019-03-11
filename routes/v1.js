import express from 'express';
import UserController from '../controllers/user';
import { validateSignup, returnValidationErrors } from '../middleware/validation';
import passportGoogle from '../auth/google';
import passportFacebook from '../auth/facebook';
import passportTwitter from '../auth/twitter';

const apiRoutes = express.Router();

apiRoutes.post(
  '/user',
  validateSignup,
  returnValidationErrors,
  UserController.registerUser,
);

apiRoutes.get(
  '/verify/:verificationId',
  UserController.verifyAccount,
);

apiRoutes.get(
  '/auth/google',
  passportGoogle.authenticate('google', {
    scope: ['email', 'profile']
  })
);

apiRoutes.get(
  '/auth/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

apiRoutes.get(
  '/auth/facebook',
  passportFacebook.authenticate('facebook', {
    scope: ['email']
  })
);

apiRoutes.get(
  '/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

apiRoutes.get(
  '/auth/twitter',
  passportTwitter.authenticate('twitter', { scope: ['email'] })
);

apiRoutes.get(
  '/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

export default apiRoutes;
