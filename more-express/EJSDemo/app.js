var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('home');
});


app.get('/fallinlovewith/:thing', function(req, res) {
  let thing = req.params.thing;
  res.render('love', {thingVar: thing});
});

app.get('/posts', function(req, res) {
  var posts = [
    {title: 'Post 1', author: 'Louie'},
    {title: 'Web Development Packages', author: 'Louie'},
    {title: 'Blah Blah Blah', author: 'Louie'}
  ];
  res.render('posts', {posts: posts});
});


app.listen('6767', function() {
  console.log('Server is listening on port 6767...');
});
