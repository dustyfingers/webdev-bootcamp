var express = require('express');
var app = express();


app.get('/', function(req, res) {
  res.render('home.ejs');
});


app.get('/fallinlovewith/:thing', function(req, res) {
  let thing = req.params.thing;
  res.render('love.ejs', {thingVar: thing});
});

app.get('/posts', function(req, res) {
  var posts = [
    {title: 'Post 1', author: 'Louie'},
    {title: 'Web Development Packages', author: 'Louie'},
    {title: 'Blah Blah Blah', author: 'Louie'}
  ];
  res.render('posts.ejs', {posts: posts});
})


app.listen('6767', function() {
  console.log('Server is listening on port 6767...');
});
