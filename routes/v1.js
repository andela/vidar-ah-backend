import express from 'express';
import UserController from '../controllers/user';
import { validateSignup, returnValidationErrors } from '../middleware/validation';
import passportGoogle from '../auth/google';

const apiRoutes = express.Router();

apiRoutes.post(
  '/user',
  validateSignup,
  returnValidationErrors,
  UserController.registerUser,
);

apiRoutes.get(
  '/verify/:verificationId',
  UserController.verifyAccount,
);

/* GOOGLE ROUTER */
apiRoutes.get('/auth/google', passportGoogle.authenticate('google', {
  scope: ['email', 'profile']
}))

apiRoutes.get('/auth/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
    // res.send('Yayyy it worked')
  });

export default apiRoutes;
