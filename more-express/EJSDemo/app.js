var express = require('express');
var app = express();


app.get('/', function(req, res) {
  res.render('home.ejs');
});


app.get('/fallinlovewith/:thing', function(req, res) {
  let thing = req.params.thing;
  res.render('love.ejs');
});


app.listen('6767', function() {
  console.log('Server is listening on port 6767...');
});
