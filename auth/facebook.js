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
async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const splitName = profile.displayName.split(' ');
  const username = splitName[0];
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} createOrFindUser
   */
  const { displayName } = profile;
  const user = await User.findOrCreate(
    {
      where: { email },
      defaults: {
        name: displayName,
        username,
        email
      }
    }
  );
  return done(null, user[0]);
}));

/**
   * @description - set the user id
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} user id
   */
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

/**
     * @description - finds the user by id
     * @param {object} user a user
     * @param {function} done end of function
     * @returns {object} user profile
     */
passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id);
  return cb(
    null, user
  );
});

export default passport;
