import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models';

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'https://vidar-ah-backend-staging.herokuapp.com/api/v1/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
},
/**
   * callback function for facebook strategy
   * @param {object} accessToken authorization token
   * @param  {object} refreshToken authorization token
   * @param  {object} profile a user profile
   * @param {function} done end of function
   * @returns {function} callback
   */
(accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

export default passport;
