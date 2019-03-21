import express from 'express';
import UserController from '../controllers/user';
import passport from '../auth/passport';
import ProfileController from '../controllers/profile';
import isUserVerified from '../middleware/verifyUser';
import Auth from '../middleware/auth';
import addImages from '../middleware/addImage';
import generateSlug from '../middleware/generateSlug';
import checkForArticle from '../middleware/checkIfArticleExist';
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
  checkIfArticleExists,
  validateSearch,
  validateCreateComment,
  validateEditComment,
  validateCommentUser,
  validateArticleExist,
  validateArticleId,
  validateArticleRating,
  validateCommentExist,
  validateGetOrder,
  validateImages,
} from '../middleware/validation';
import FollowController from '../controllers/follow';
import followVerification from '../middleware/follow';
import CommentController from '../controllers/comment';

const {
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
  rateArticle,
  getAllArticles,
  getArticlesByHighestField
} = ArticleController;
const { viewProfile, editProfile, updateProfileImage } = ProfileController;

const apiRoutes = express.Router();

apiRoutes.route('/user/signup')
  .post(validateSignup, returnValidationErrors, UserController.registerUser);
apiRoutes.get('/verify/:verificationId', UserController.verifyAccount);

apiRoutes.route('/userprofile')
  .get(Auth.verifyUser, isUserVerified, viewProfile)
  .patch(Auth.verifyUser, isUserVerified, addImages, validateProfileChange,
    returnValidationErrors, editProfile);

apiRoutes.route('/userprofile/image')
  .patch(Auth.verifyUser, isUserVerified, addImages,
    validateImages, returnValidationErrors, updateProfileImage);

apiRoutes.route('/verify/:verificationId')
  .get(UserController.verifyAccount);

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
  )
  .get(getAllArticles);

apiRoutes.get(
  '/articles/order',
  validateGetOrder,
  returnValidationErrors,
  getArticlesByHighestField
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

apiRoutes.route('/articles/rate/:articleId')
  .post(Auth.verifyUser, isUserVerified,
    validateArticleId, validateArticleRating,
    returnValidationErrors, checkForArticle, rateArticle);

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
apiRoutes.get(
  '/articles/search',
  validateSearch,
  returnValidationErrors,
  ArticleController.searchForArticles,
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
apiRoutes.route('/comment/:id')
  .post(Auth.verifyUser,
    isUserVerified,
    validateArticleExist,
    validateCreateComment,
    returnValidationErrors,
    CommentController.createComment)
  .patch(Auth.verifyUser,
    isUserVerified,
    validateCommentUser,
    validateEditComment,
    returnValidationErrors,
    CommentController.editComment)
  .delete(Auth.verifyUser,
    isUserVerified,
    validateCommentUser,
    returnValidationErrors,
    CommentController.deleteComment);


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


apiRoutes.post(
  '/likeArticle/:slug',
  Auth.verifyUser,
  isUserVerified,
  checkIfArticleExists,
  likeArticle
);

apiRoutes.post(
  '/dislikeArticle/:slug',
  Auth.verifyUser,
  isUserVerified,
  checkIfArticleExists,
  dislikeArticle
);
apiRoutes.get(
  '/articles/search',
  validateSearch,
  returnValidationErrors,
  ArticleController.searchForArticles,
);

apiRoutes.get(
  '/articles/:slug',
  Auth.isLoggedIn,
  ArticleController.getArticleBySlug,
);

apiRoutes.post(
  '/follow/:id',
  Auth.verifyUser,
  followVerification,
  FollowController.followUser
);

apiRoutes.post(
  '/unfollow/:id',
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

apiRoutes.route('/comments/:id/like')
  .post(
    Auth.verifyUser,
    isUserVerified,
    validateCommentExist,
    CommentController.likeComment
  );

apiRoutes.get(
  '/user/readingstats',
  Auth.verifyUser,
  UserController.getReadingStats
);

export default apiRoutes;
