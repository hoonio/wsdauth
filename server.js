const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fetch = require('node-fetch');
const passport = require('./passport');
const exphbs  = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', passport.authenticate('oauth2', { session: false, failureRedirect: '/login' }), (req, res) => {
  console.log('login callback: '+req.user);
  res.cookie('auth', req.user);
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  console.log('Token: ' + req.cookies.auth)
  fetch('https://staging-auth.wallstreetdocs.com/oauth/userinfo', { headers: {
    Authorization: 'Bearer ' + req.cookies.auth,
    'Cache-Control': 'no-cache'
  }})
  .then((res) => {
    if (res.status == 401) {
      res.redirect('/login');
    }
    return res.text();
  })
  .then((json) => {
    res.render('../index.handlebars', {
      loggedin: true,
      user: json
    });
  })
});

app.get('/login', (req, res) => {
  res.render('../index.handlebars', {
    loggedin: false
  });
})

app.get('*', (req, res) => {
    if (req.query.code) {
      console.log(req.query.code);
      res.cookie('auth', req.query.code);
    }
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
