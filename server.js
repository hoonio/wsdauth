const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');

const passport = require('./passport');
const userData = require('./userdata');

const app = express();
const port = process.env.PORT || 3000

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/profile', userData.getSignedUserData);

app.get('/login', (req, res) => {
  res.render('../index.handlebars', {
    loggedin: false
  });
})

app.get('*', passport.authenticate('oauth2', { session: false, failureRedirect: '/login' }), (req, res) => {
  res.cookie('auth', req.user);
  res.redirect('/profile');
});

app.set('port', port);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info('Listening on port ', port);
  }
});
