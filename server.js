const express = require('express');
const path = require('path');
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

app.get('/', (req, res) => {
  if (!req.cookies.auth && !req.query.code) {
    // res.sendFile(path.join( __dirname, './profile.html'));
    console.log('load main page')
    res.render('../index.handlebars', {
      loggedin: false
    });
  } else {
    console.log('querystring: '+req.query.code)
    passport.authenticate('oauth2', (err, user) => {
      console.log('login callback: '+ user);
      res.cookie('auth', user);
      res.redirect('/profile');
    })(req, res);
  }
});

app.get('/login', (req, res) => {
  res.redirect('/?code=login');
});

app.get('/profile', (req, res) => {
  console.log('Token: ' + req.cookies.auth)
  fetch('https://staging-auth.wallstreetdocs.com/oauth/userinfo', { headers: {
    Authorization: 'Bearer ' + req.cookies.auth,
    'Cache-Control': 'no-cache'
  }})
  .then((res) => {
    console.log(res.status)
    // check res.status, place redirect to login on 401
    return res.text();
  })
  .then((json) => {
    console.log(json)
    res.render('../index.handlebars', {
      loggedin: true,
      user: json
    });
  })
});

app.get('*', (req, res) => {
  if (!req.cookies.auth && !req.query.code) {
    // res.sendFile(path.join( __dirname, './profile.html'));
    res.render('../index.handlebars', {
      loggedin: false
    });
  } else {
    if (req.query.code) {
      console.log(req.query.code);
      res.cookie('auth', req.query.code);
    }
    res.redirect('/profile');
  }
});

app.set('port', port);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info('Listening on port ', port);
  }
});
