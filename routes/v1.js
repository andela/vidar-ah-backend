import express from 'express';
import UserController from '../controllers/user';
import passport from '../auth/passport';
import ProfileController from '../controllers/profile';
import isUserVerified from '../middleware/verifyUser';
import Auth from '../middleware/auth';
import addImages from '../middleware/addImage';
import generateSlug from '../middleware/generateSlug';
import ArticleController from '../controllers/articles';
import CategoryController from '../controllers/category';
import verifyCategoryId from '../middleware/verifyCategoryId';
import {
  validateSignup,
  validateLogin,
  validateProfileChange,
  validateEmail,
  validatePassword,
  validateArticle,
  validateArticleAuthor,
  validateCategory,
  validateSearch,
  returnValidationErrors
} from '../middleware/validation';
import FollowController from '../controllers/follow';
import followVerification from '../middleware/follow';

const { createArticle, updateArticle, deleteArticle } = ArticleController;

const apiRoutes = express.Router();

apiRoutes.route('/user/signup')
  .post(validateSignup, returnValidationErrors, UserController.registerUser);

apiRoutes.route('/userprofile')
  .get(Auth.verifyUser, isUserVerified, ProfileController.viewProfile)
  .patch(Auth.verifyUser, isUserVerified, validateProfileChange,
    returnValidationErrors, ProfileController.editProfile);

apiRoutes.route('/verify/:verificationId')
  .get(UserController.verifyAccount);

apiRoutes.route('/articles')
  .post(
    Auth.verifyUser,
    isUserVerified,
    addImages,
    validateArticle,
    returnValidationErrors,
    generateSlug,
    createArticle
  );

apiRoutes.route('/articles/:slug')
  .put(
    Auth.verifyUser,
    isUserVerified,
    validateArticleAuthor,
    addImages,
    validateArticle,
    returnValidationErrors,
    updateArticle,
    generateSlug
  );

apiRoutes.route('/articles/:slug')
  .delete(
    Auth.verifyUser,
    isUserVerified,
    validateArticleAuthor,
    deleteArticle
  );

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

apiRoutes.post(
  '/category',
  Auth.verifyUser,
  isUserVerified,
  Auth.authorizeAdmin,
  validateCategory,
  returnValidationErrors,
  CategoryController.createCategory
);

apiRoutes.patch(
  '/category/:id',
  Auth.verifyUser,
  isUserVerified,
  Auth.authorizeAdmin,
  validateCategory,
  returnValidationErrors,
  verifyCategoryId,
  CategoryController.updateCategory
);

apiRoutes.delete(
  '/category/:id',
  Auth.verifyUser,
  isUserVerified,
  Auth.authorizeAdmin,
  verifyCategoryId,
  CategoryController.deleteCategory
);

apiRoutes.post(
  '/requestpasswordreset',
  validateEmail,
  returnValidationErrors,
  isUserVerified,
  UserController.requestPasswordReset,
);

apiRoutes.post(
  '/resetpassword/:passwordResetToken',
  validatePassword,
  returnValidationErrors,
  UserController.resetPassword
);

apiRoutes.get(
  '/articles/search',
  validateSearch,
  returnValidationErrors,
  ArticleController.searchForArticles,
);

apiRoutes.get(
  '/articles/:slug',
  ArticleController.getArticleBySlug,
);

apiRoutes.get(
  '/follow/:id',
  Auth.verifyUser,
  followVerification,
  FollowController.followUser
);

apiRoutes.get(
  '/unfollow/:id',
  Auth.verifyUser,
  followVerification,
  FollowController.unfollowUser
);
export default apiRoutes;
