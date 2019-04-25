import express from 'express';
import jwt from 'jsonwebtoken';
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
import NotificationsController from '../controllers/notifications';
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
  validateGetOrder,
  validateCommentExist,
  validateImages,
  validateInterest,
  validateReport,
  validateNotificationChoice,
} from '../middleware/validation';
import followController from '../controllers/follow';
import followVerification from '../middleware/follow';
import CommentController from '../controllers/comment';
import ReportsController from '../controllers/reports';

const {
  followUser, unfollowUser, getUserFollowers, getUserFollowings
} = followController;

const {
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  dislikeArticle,
  rateArticle,
  getAllArticles,
  getArticlesByHighestField,
  getAllReactions,
} = ArticleController;

const { viewProfile, editProfile, updateProfileImage } = ProfileController;

const apiRoutes = express.Router();

apiRoutes.route('/user/signup')
  .post(validateSignup, validateInterest, returnValidationErrors, UserController.registerUser);

apiRoutes.route('/userprofile')
  .get(Auth.verifyUser, isUserVerified, viewProfile)
  .patch(Auth.verifyUser, isUserVerified, addImages, validateProfileChange,
    validateInterest, returnValidationErrors, editProfile);

apiRoutes.route('/userprofile/image')
  .patch(Auth.verifyUser, isUserVerified, addImages,
    validateImages, returnValidationErrors, updateProfileImage);

apiRoutes.route('/verify/:verification_id')
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
    'google', { failureRedirect: `${process.env.HOST_URL_FRONTEND}/login` }
  ),
  (req, res) => {
    const { user } = req;
    user.password = undefined;
    user.verified = undefined;
    user.verificationId = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    const token = jwt.sign({ ...req.user }, process.env.JWT_SECRET);
    res.redirect(`${process.env.HOST_URL_FRONTEND}/social/callback?token=${token}`);
  });

apiRoutes.get('/auth/facebook',
  passport.authenticate(
    'facebook', {
      scope: ['email']
    }
  ));

apiRoutes.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook', { failureRedirect: `${process.env.HOST_URL_FRONTEND}/login` }
  ),
  (req, res) => {
    const { user } = req;
    user.password = undefined;
    user.verified = undefined;
    user.verificationId = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    const token = jwt.sign({ ...req.user }, process.env.JWT_SECRET);
    res.redirect(`${process.env.HOST_URL_FRONTEND}/social/callback?token=${token}`);
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
  '/resetpassword/:password_reset_token',
  validatePassword,
  returnValidationErrors,
  UserController.resetPassword
);

apiRoutes.post(
  '/like_article',
  Auth.verifyUser,
  isUserVerified,
  checkIfArticleExists,
  likeArticle
);

apiRoutes.post(
  '/dislike_article',
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
  '/follow',
  Auth.verifyUser,
  followVerification,
  followUser
);

apiRoutes.post(
  '/unfollow',
  Auth.verifyUser,
  followVerification,
  unfollowUser
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

apiRoutes.get(
  '/user/readingstats',
  Auth.verifyUser,
  UserController.getReadingStats
);
apiRoutes.route('/comments/:id/like')
  .post(
    Auth.verifyUser,
    isUserVerified,
    validateCommentExist,
    CommentController.likeComment
  );

apiRoutes.post(
  '/report/',
  Auth.verifyUser,
  validateReport,
  returnValidationErrors,
  ReportsController.reportArticle
);

apiRoutes.get(
  '/reports',
  Auth.verifyUser,
  Auth.authorizeAdmin,
  ReportsController.getReports
);

apiRoutes.route('/user/followers')
  .get(
    Auth.verifyUser,
    isUserVerified,
    getUserFollowers
  );

apiRoutes.route('/user/followings')
  .get(
    Auth.verifyUser,
    isUserVerified,
    getUserFollowings
  );

apiRoutes.route('/user/articlescount')
  .get(
    Auth.verifyUser,
    UserController.getUserArticlesCount
  );

apiRoutes.route('/user/article_reactions')
  .get(
    Auth.verifyUser,
    getAllReactions
  );
apiRoutes.get(
  '/notifications',
  Auth.verifyUser,
  isUserVerified,
  NotificationsController.getNotifications
);

apiRoutes.patch(
  '/notifications',
  Auth.verifyUser,
  isUserVerified,
  validateNotificationChoice,
  NotificationsController.setNotificationChoice
);

export default apiRoutes;
