import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../models';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:7000/api/v1/auth/google/callback',
},
/**
   * callback function for google strategy
   * @param {object} accessToken authorization token
   * @param  {object} refreshToken authorization token
   * @param  {object} profile a user profile
   * @param {function} done end of function
   * @returns {function} callback
   */
async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} createOrFindUser
   */
  const {
    displayName,
    name: { givenName }
  } = profile;
  const user = await User.findOrCreate(
    {
      where: { email },
      defaults: {
        name: displayName,
        username: givenName,
        email
      }
    }
  );
  return done(
    null, user[0].dataValues
  );
}));

/**
   * @description - set the user id
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} user id
   */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
   * @description - finds the user by id
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} user profile
   */
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  return done(null, user);
});

export default passport;
