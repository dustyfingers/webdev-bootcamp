const express = require('express');
const app = express();
const port = '5555';


// index route
app.get('/', function(req, res) {
  res.send('Hi there! Welcome to my assignment!');
});


// speak route
app.get('/speak/:animal', function(req, res) {
  var sounds = {
    pig: 'oink',
    cow: 'moo',
    cat: 'meow',
    dog: 'woof',
    lizard: ' . . . '
  }
  // get the animal from the request and lowercase it
  var animal = req.params.animal.toLowerCase();
  // use animal key to query the sounds object
  // and assign the returned value from the key-value
  //  pair to the sound variable
  var sound = sounds[animal];
  res.send(`The ${animal} says '${sound}'`);
});


// repeat route
app.get('/repeat/:message/:number', function(req, res) {
  var message = req.params.message;
  var times = parseInt(req.params.number);
  var result = '';
  for (let i = 0; i < times; i++) {
    result += message;
  }
  res.send(`${result}` + "  ");
});


// catch-all route
app.get('*', function(req, res) {
  res.send('File not found, what are you doing with your life?');
});

app.listen(port, function(req, res) {
  console.log('Server started.');
});
