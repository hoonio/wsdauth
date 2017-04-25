const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000

app.get('*', function(req, res) {
  res.sendFile(path.join( __dirname, './index.html'));
});

app.set('port', port);

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.info('Listening on port ', port);
  }
});
