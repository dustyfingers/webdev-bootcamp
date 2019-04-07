var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var friends = ['Tony', "Miranda", "Justin", "Lily", "Adam"];


app.get('/', function(req, res) {
  res.render('home');
});


app.get('/friends', function(req, res) {
  res.render('friends', {friends: friends});
});


app.post('/addfriend', function(req, res) {
  var newFriend = req.body.newFriend;
  friends.push(newFriend);
  res.redirect('/friends');
});


app.listen('5000', function() {
  console.log('Server started on port 5000');
});
