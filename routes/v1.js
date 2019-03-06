import express from 'express';
import UserController from '../controllers/user';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import isUserVerified from '../middleware/verifyUser';
import ArticleController from '../controllers/articles';
import {
  validateSignup,
  validateProfileChange,
  returnValidationErrors,
  validateArticle,
} from '../middleware/validation';

const { createArticle } = ArticleController;

const apiRoutes = express.Router();

apiRoutes.route('/user')
  .post(validateSignup, returnValidationErrors, UserController.registerUser);

apiRoutes.route('/userprofile')
  .get(Auth.verifyUser, isUserVerified, ProfileController.viewProfile)
  .patch(Auth.verifyUser, isUserVerified, validateProfileChange,
    returnValidationErrors, ProfileController.editProfile);

apiRoutes.route('/verify/:verificationId')
  .get(UserController.verifyAccount);

apiRoutes.route('/articles')
  .post(Auth.verifyUser, isUserVerified, validateArticle, returnValidationErrors, createArticle);

export default apiRoutes;
