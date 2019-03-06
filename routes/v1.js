import express from 'express';
import UserController from '../controllers/user';
import ArticleController from '../controllers/articles';
import { validateSignup, returnValidationErrors, validateArticle } from '../middleware/validation';
import authUser from '../middleware/auth';

const { createArticle } = ArticleController;

const apiRoutes = express.Router();

apiRoutes.route('/user')
  .post(validateSignup, returnValidationErrors, UserController.registerUser);

apiRoutes.route('/verify/:verificationId')
  .get(UserController.verifyAccount);

apiRoutes.route('/articles')
  .post(authUser, validateArticle, returnValidationErrors, createArticle);

export default apiRoutes;
