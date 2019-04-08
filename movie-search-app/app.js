// Here's the new way of making requests with the key:
//
// General search: http://www.omdbapi.com/?s=guardians+of+the+galaxy&apikey=thewdb
//
// Search with Movie ID: http://www.omdbapi.com/?i=tt3896198&apikey=thewdb
//
// So everything is exactly the same as Colt explains in the following videos, except you must append &apikey=thewdb to the end of your url.
var express = require('express');
var request = require('request');
var app = express();
var port = 8088;
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('search');
})


app.get('/results', (req, res) => {
  var query = req.query.search;
  request(`http://omdbapi.com/?s=${query}&apikey=thewdb`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.render('results', {data: data});
    }
  });
});


app.listen(port, () => {
  console.log(`Movie app is live on ${port}`);
});
