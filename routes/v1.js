import express from 'express';
import UserController from '../controllers/user';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import isUserVerified from '../middleware/verifyUser';
import {
  validateSignup, validateLogin,
  validateProfileChange, returnValidationErrors
} from '../middleware/validation';
import passportGoogle from '../auth/google';
import passportFacebook from '../auth/facebook';

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
/* GOOGLE ROUTER */
apiRoutes.get('/auth/google', passportGoogle.authenticate('google', {
  scope: ['email', 'profile']
}));

apiRoutes.get(
  '/auth/google/callback',
  passportGoogle.authenticate(
    'google', { failureRedirect: '/login' }
  ),
  (req, res) => {
    res.redirect('/');
    // res.send('Yayyy it worked')
  }
);

/* FACEBOOK ROUTER */
apiRoutes.get(
  '/auth/facebook', passportFacebook.authenticate(
    'facebook', {
      scope: ['email', 'profile']
    }
  )
);

apiRoutes.get(
  '/auth/facebook/callback',
  passportFacebook.authenticate(
    'facebook', { failureRedirect: '/login' }
  ),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

export default apiRoutes;
