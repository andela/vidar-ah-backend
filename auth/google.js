import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../models';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://127.0.0.1:7000/api/v1/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  User.findOrCreate(
    {
      where: { email },
      defaults: {
        name: profile.displayName,
        username: profile.name.givenName,
        email
      }
    }
  )
    .then(user => done(null, user[0].dataValues));
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  return done(null, user);
});

export default passport;
