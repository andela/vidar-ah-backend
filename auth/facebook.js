import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models';

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://vidar-ah-backend-staging.herokuapp.com/api/v1/auth/facebook/callback',
},
(accessToken, refreshToken, profile, done) => {
  done(null, profile);
  console.log(profile);

  // const email = profile.emails[0].value;
  // User.findOrCreate(
  //   {
  //     where: { email },
  //     defaults: {
  //       name: profile.displayName,
  //       username: profile.name.givenName,
  //       email
  //     }
  //   }
  // );
}));

export default passport;
