import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../models';

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:7000/api/v1/auth/twitter/callback',
  includeEmail: true
},
/**
   * callback function for twitter strategy
   * @param {object} token authorization token
   * @param  {object} tokenSecret authorization token
   * @param  {object} profile a user profile
   * @param {function} cb end of function
   * @returns {function} callback
   */
async (token, tokenSecret, profile, cb) => {
  const email = profile.emails[0].value;
  /**
   * @description - finds an existing user or create a new user
   * @param {object} user a user
   * @param {function} done end of function
   * @returns {object} createOrFindUser
   */
  const { displayName, username } = profile;
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
  return cb(
    null, user[0]
  );
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
  return cb(null, user);
});

export default passport;
