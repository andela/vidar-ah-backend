import express from 'express';
import UserController from '../controllers/user';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import { validateSignup, validateProfileChange, returnValidationErrors } from '../middleware/validation';

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

// Profiles route

apiRoutes.get(
  '/userprofile',
  Auth.verifyUser,
  ProfileController.viewProfile,
);

apiRoutes.patch(
  '/userprofile',
  Auth.verifyUser,
  validateProfileChange,
  returnValidationErrors,
  ProfileController.editProfile
);

export default apiRoutes;
