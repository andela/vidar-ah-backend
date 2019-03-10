import passport from 'passport';
import googlePassport from 'passport-google-oauth';
import { User } from '../models';

const GoogleStrategy = googlePassport.OAuth2Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://vidar-ah-backend-staging.herokuapp.com/api/v1/auth/google/callback',
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
  // .catch(error => done(error))
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(error => console.log(error));
});

export default passport;
