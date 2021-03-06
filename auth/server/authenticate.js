const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((user, done) => {
    done(null, user.id);
})

passport.use(new GoogleStrategy({
    // make different file to store client ID and secret 
    clientID: '520348155728-oa29jrs09g5816qhsre1qvhn8sro1ib1.apps.googleusercontent.com',
    clientSecret: 'qsPOL0W2iVQLidybRCZzvKcm',
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Register user here. If the user doesn't have a google account to sign in 
    console.log(profile)
    cb(null, profile);
  }
));