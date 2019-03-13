import express from 'express';
import UserController from '../controllers/user';
import ProfileController from '../controllers/profile';
import isUserVerified from '../middleware/verifyUser';
import {
  validateSignup,
  validateProfileChange,
  validateEmail,
  returnValidationErrors,
  validatePassword
} from '../middleware/validation';
import PasswordReset from '../controllers/PasswordReset';
import VerifyPasswordToken from '../controllers/VerifyPasswordToken';
import Auth from '../middleware/auth';

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
  '/resetpassword',
  validateEmail,
  returnValidationErrors,
  isUserVerified,
  PasswordReset.resetPassword,
);

apiRoutes.post(
  '/verifypasswordkey/:passwordResetToken',
  validatePassword,
  returnValidationErrors,
  VerifyPasswordToken.checkPasswordToken
);

export default apiRoutes;
