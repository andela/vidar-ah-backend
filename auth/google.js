import passport from 'passport';
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import { User } from '../models/';


passport.use(new GoogleStrategy({
    clientID: "82790996682-n2ln8cnl9huo3pnagmm9olqm50jgmvbb.apps.googleusercontent.com",
    clientSecret: "Yq_f6I9YjsVC0hECiRzpUMqb",
    callbackURL: "http://127.0.0.1:7000/api/v1/auth/google/callback",
},
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;  
    User.findOrCreate(
        { where: { email },
        defaults: {
            name: profile.displayName,
            username: profile.name.givenName,
            email
        }
    })
        .then(user => done(null, user[0].dataValues))
        // .catch(error => done(error))
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
    .catch(error => console.log(error));
});

export default passport;
