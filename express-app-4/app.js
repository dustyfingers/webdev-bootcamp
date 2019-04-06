var express = require('express');
var app = express();
var port = '8888';

app.use(express.static('public'));
app.set('view engine', 'ejs');



app.get('/', function(req, res) {
  res.render('home'); // .ejs file. you don need to use the extension when you use app.set like above
});

app.get('/fallinlovewith/:thing', function(req, res){
  var thing = req.params.thing;
  res.render('love', {thingVar: thing});
});

app.get('/posts', function(req, res){
  var posts = [
    {title: 'Post 1', author: 'Louie Williford'},
    {title: 'Post 2', author: 'Rosie Santana'},
    {title: 'Post 3', author: 'Louie Williford'},
    {title: 'Post 4', author: 'Carl Stewert'},
    {title: 'Post 5', author: 'Adam Appleton'}
  ];
  res.render('posts', {posts: posts});
});




app.listen(port, function(){
  console.log('Server is listening!');
});
