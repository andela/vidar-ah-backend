import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../models';

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:7000/api/v1/auth/twitter/callback',
  includeEmail: true
},
(token, tokenSecret, profile, cb) => {
  const email = profile.emails[0].value;

  User.findOrCreate(
    {
      where: { email },
      defaults: {
        name: profile.displayName,
        username: profile.username,
        email
      }
    }
  )
    .then(user => cb(null, user[0]));
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id);
  return cb(null, user);
});

export default passport;
