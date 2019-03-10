import passport from 'passport';
import facebookPassport from 'passport-facebook';
import { User } from '../models';

const FacebookStrategy = facebookPassport.Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'https://vidar-ah-backend-staging.herokuapp.com/api/v1/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
},
(accessToken, refreshToken, profile, done) => {
  console.log(profile);
}));

export default passport;
