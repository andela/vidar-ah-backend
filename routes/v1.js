import express from 'express';
import UserController from '../controllers/user';
import { validateSignup, returnValidationErrors } from '../middleware/validation';
import passport from '../auth/passport';

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
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
);

apiRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

apiRoutes.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
);

apiRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);


export default apiRoutes;
