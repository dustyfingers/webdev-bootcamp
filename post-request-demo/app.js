var express = require('express');
var app = express();
var port = '4040';

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('home');
});


app.get('/friends', function(req, res) {
  var friends = ['Tony', 'Justin', 'Jackson', 'Pierre', 'Adam', 'Rosie', 'Lily'];
  res.render('friends', {friends: friends});
});


app.post('/addfriend', function(req, res) {
  console.log(req.body);
  res.send('YOU HAVE REACHED THE POST ROUTE');
});


app.listen(port, function() {
  console.log("Server started.");
});
