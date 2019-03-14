import express from 'express';
import UserController from '../controllers/user';
import passport from '../auth/passport';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import addImages from '../middleware/addImage';
import generateSlug from '../middleware/generateSlug';
import isUserVerified from '../middleware/verifyUser';
import ArticleController from '../controllers/articles';
import {
  validateSignup,
  validateLogin,
  validateProfileChange,
  returnValidationErrors,
  validateArticle,
  validateUser
} from '../middleware/validation';

const { createArticle, updateArticle, deleteArticle } = ArticleController;

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
  .post(Auth.verifyUser, isUserVerified,
    addImages,
    validateArticle,
    returnValidationErrors,
    generateSlug,
    createArticle);

apiRoutes.route('/articles/:id')
  .put(Auth.verifyUser, isUserVerified,
    validateUser,
    addImages,
    validateArticle,
    returnValidationErrors,
    generateSlug,
    updateArticle);

apiRoutes.route('/articles/:id')
  .delete(Auth.verifyUser, isUserVerified,
    validateUser,
    deleteArticle);

apiRoutes.get('/auth/google',
  passport.authenticate(
    'google', {
      scope: ['email', 'profile']
    }
  ));

apiRoutes.get('/auth/google/callback',
  passport.authenticate(
    'google', { failureRedirect: '/login' }
  ),
  (req, res) => {
    res.redirect('/');
  });

apiRoutes.get('/auth/facebook',
  passport.authenticate(
    'facebook', {
      scope: ['email']
    }
  ));

apiRoutes.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook', { failureRedirect: '/login' }
  ),
  (req, res) => {
    res.redirect('/');
  });

apiRoutes.post(
  '/user/login',
  validateLogin,
  returnValidationErrors,
  isUserVerified,
  UserController.loginUser
);

export default apiRoutes;
