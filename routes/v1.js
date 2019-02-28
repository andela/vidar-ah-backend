import express from 'express';
import UserController from '../controllers/user';
import { validateSignup, returnValidationErrors } from '../middleware/validation';
const apiRoutes = express.Router();

apiRoutes.post(
  '/user', 
  validateSignup, 
  returnValidationErrors, 
  UserController.registerUser
);

apiRoutes.get(
  '/verify/:verificationId',
  UserController.verifyAccount
);

export default apiRoutes;
