const fetch = require('node-fetch');

exports.getSignedUserData = (req, res) => {
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
};
