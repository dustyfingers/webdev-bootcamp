var express = require('express');
var app = express();
var port = '4000';


app.get('/', function(req, res){
  console.log('Home Page!');
  res.send('Home Page!');
  console.log(req.params);
});


app.listen(port, function(){
  console.log(`I'm listening on port ${port}!`)
})
