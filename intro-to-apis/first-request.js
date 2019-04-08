let request = require('request');

// making an http request with node
// pass in the url and what to do with it request(URL, function(error, response, body){})
//
request('https://www.google.com', function(error, response, body) {
  if (error) {
    console.log('SOMETHING WENT WRONG');
    console.log(error);
  } else {
    if (response.statusCode == 200) {
      console.log(body);
    }
  }
});
