import express from 'express';
import UserController from '../controllers/user';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import isUserVerified from '../middleware/verifyUser';
import PasswordReset from '../controllers/PasswordReset';
import VerifyPasswordToken from '../controllers/VerifyPasswordToken';
import ChangePassword from '../controllers/ChangePassword';
import {
  validateSignup,
  validateLogin,
  validateProfileChange,
  validateEmail,
  validatePassword,
  returnValidationErrors
} from '../middleware/validation';
import passportGoogle from '../auth/google';
import passportFacebook from '../auth/facebook';
import passportTwitter from '../auth/twitter';

const apiRoutes = express.Router();

apiRoutes.post('/user', validateSignup, returnValidationErrors, UserController.registerUser);

apiRoutes.get('/verify/:verificationId', UserController.verifyAccount);

// Profiles route

apiRoutes.get('/userprofile', Auth.verifyUser, isUserVerified, ProfileController.viewProfile);

apiRoutes.patch(
  '/userprofile',
  Auth.verifyUser,
  isUserVerified,
  validateProfileChange,
  returnValidationErrors,
  ProfileController.editProfile
);

apiRoutes.post(
  '/user/login',
  validateLogin,
  returnValidationErrors,
  UserController.loginUser,
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

apiRoutes.post(
  '/resetpassword',
  validateEmail,
  returnValidationErrors,
  isUserVerified,
  PasswordReset.resetPassword,
);

apiRoutes.get(
  '/verifypasswordkey/:passwordResetToken',
  VerifyPasswordToken.checkPasswordToken
);

apiRoutes.post(
  '/changepassword',
  Auth.verifyUser,
  validatePassword,
  returnValidationErrors,
  ChangePassword.changePassword,
);

export default apiRoutes;
