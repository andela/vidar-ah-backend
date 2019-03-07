import passport from 'passport';
import facebookPassport from 'passport-facebook';
import { User } from '../models/';

const FacebookStrategy = facebookPassport.Strategy;

passport.use(new FacebookStrategy({
    clientID: "998262500369173",
    clientSecret: "3f1b0303b9d5c13d1c1a809e43d15ced",
    callbackURL: "http://localhost:7000/api/v1/auth/facebook/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile)
  }
));

export default passport;