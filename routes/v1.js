import express from 'express';
import UserController from '../controllers/user';
import passport from '../auth/passport';
import ProfileController from '../controllers/profile';
import Auth from '../middleware/auth';
import isUserVerified from '../middleware/verifyUser';
import PasswordReset from '../controllers/PasswordReset';
import VerifyPasswordToken from '../controllers/VerifyPasswordToken';
import ChangePassword from '../controllers/ChangePassword';
import {
  validateSignup,
  validateLogin,
  validateProfileChange,
  validateEmail,
  validatePassword,
  returnValidationErrors,
  validateArticle
} from '../middleware/validation';
import addImages from '../middleware/addImage';
import generateSlug from '../middleware/generateSlug';
import ArticleController from '../controllers/articles';


const apiRoutes = express.Router();
const { createArticle } = ArticleController;

apiRoutes.post('/user', validateSignup, returnValidationErrors, UserController.registerUser);
apiRoutes.get('/verify/:verificationId', UserController.verifyAccount);

// Profiles route

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

apiRoutes.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

apiRoutes.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
);

apiRoutes.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);


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

apiRoutes.post(
  '/resetpassword',
  validateEmail,
  returnValidationErrors,
  isUserVerified,
  PasswordReset.resetPassword,
);

apiRoutes.get(
  '/verifypasswordkey/:passwordResetToken',
  VerifyPasswordToken.checkPasswordToken
);

apiRoutes.post(
  '/changepassword',
  Auth.verifyUser,
  validatePassword,
  returnValidationErrors,
  ChangePassword.changePassword,
);

export default apiRoutes;
