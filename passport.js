const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://staging-auth.wallstreetdocs.com/oauth/authorize',
    tokenURL: 'https://staging-auth.wallstreetdocs.com/oauth/token',
    clientID: 'coding_test',
    clientSecret: 'bwZm5XC6HTlr3fcdzRnD',
    callbackURL: "http://localhost:3000"
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ exampleId: profile.id }, (err, user) => cb(err, user) );
  }
));

module.exports = passport;
