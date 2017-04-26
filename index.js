const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('./passport');
var exphbs  = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000

var hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  console.log(req.query.code)
  res.render('../index.handlebars', {
    body: 'Consolidate.js'
  });
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join( __dirname, './profile.html'));
});

app.get('/login', (req, res, next) => {
  passport.authenticate('oauth2', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    console.log(user);
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/profile');
    });
  })(req, res, next);
});

// app.get('/login',
//   passport.authenticate('oauth2', { failureRedirect: '/' }), (req, res) => {
//   res.sendFile(path.join( __dirname, './profile.html'));
// });

app.get('*',
  passport.authenticate('oauth2'));

app.set('port', port);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info('Listening on port ', port);
  }
});
