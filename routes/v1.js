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
import {
  validateSignup,
  validateLogin,
  validateProfileChange,
  validateEmail,
  validatePassword,
  validateArticle,
  validateArticleAuthor,
  validateCategory,
  returnValidationErrors,
  validateCreateComment,
  validateEditComment,
  validateCommentUser,
  validateArticleExist,
} from '../middleware/validation';
import CommentController from '../controllers/comment';

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

apiRoutes.route('/category')
  .post(
    Auth.verifyUser,
    isUserVerified,
    validateCategory,
    returnValidationErrors,
    CategoryController.createCategory
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

apiRoutes.route('/articles/:slug/comments')
  .post(
    Auth.verifyUser,
    isUserVerified,
    validateArticleExist,
    validateCreateComment,
    returnValidationErrors,
    CommentController.createComment
  )
  .get(
    Auth.verifyUser,
    isUserVerified,
    validateArticleExist,
    CommentController.getComments
  );

apiRoutes.route('/articles/:slug/comments/:id')
  .patch(
    Auth.verifyUser,
    isUserVerified,
    validateCommentUser,
    validateEditComment,
    returnValidationErrors,
    CommentController.editComment
  )
  .delete(
    Auth.verifyUser,
    isUserVerified,
    validateCommentUser,
    returnValidationErrors,
    CommentController.deleteComment
  );


export default apiRoutes;
