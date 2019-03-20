import express from 'express';
import UserController from '../controllers/user';
import passport from '../auth/passport';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import addImages from '../middleware/addImage';
import generateSlug from '../middleware/generateSlug';
import isUserVerified from '../middleware/verifyUser';
import ArticleController from '../controllers/articles';
import CategoryController from '../controllers/category';
import passportTwitter from '../auth/twitter';
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
  returnValidationErrors,
  validateCreateComment,
  validateEditComment,
  validateCommentUser,
  validateArticleExist,
} from '../middleware/validation';
import FollowController from '../controllers/follow';
import followVerification from '../middleware/follow';
import CommentController from '../controllers/comment';

const { createArticle, updateArticle, deleteArticle } = ArticleController;

const apiRoutes = express.Router();

apiRoutes.post('/user/signup', validateSignup, returnValidationErrors, UserController.registerUser);
apiRoutes.get('/verify/:verificationId', UserController.verifyAccount);

apiRoutes.route('/userprofile')
  .get(Auth.verifyUser, isUserVerified, ProfileController.viewProfile)
  .patch(Auth.verifyUser, isUserVerified, validateProfileChange,
    returnValidationErrors, ProfileController.editProfile);


apiRoutes.post(
  '/user/login',
  validateLogin,
  returnValidationErrors,
  isUserVerified,
  UserController.loginUser,
);

apiRoutes.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
);
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
  ), UserController.socialAuth,
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
  ), UserController.socialAuth,
  (req, res) => {
    res.redirect('/');
  });

apiRoutes.get('/auth/twitter',
  passport.authenticate(
    'twitter', {
      scope: ['profile']
    }
  ));

apiRoutes.get('/auth/twitter/callback',
  passport.authenticate(
    'twitter', { failureRedirect: '/login' }
  ), UserController.socialAuth,
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

apiRoutes.get(
  '/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

apiRoutes.post(
  '/resetpassword/:passwordResetToken',
  validatePassword,
  returnValidationErrors,
  UserController.resetPassword
);

apiRoutes.get(
  '/followuser/:id',
  Auth.verifyUser,
  followVerification,
  FollowController.followUser
);

apiRoutes.get(
  '/unfollowuser/:id',
  Auth.verifyUser,
  followVerification,
  FollowController.unfollowUser
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
