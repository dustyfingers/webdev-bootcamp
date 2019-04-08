// LOCUS is awesome and you can use it to troubleshoot your backend!! http response codes etc
// also promises are cool, learn more about them!
//
const rp = require('request-promise');

// ES6 ified!!! promises, template literal strings, arrow functions
//
rp('https://jsonplaceholder.typicode.com/users/1')
.then((body) => {
  const parsedData = JSON.parse(body);
  console.log(`${parsedData.name} lives in ${parsedData.address.city}`);
})
.catch((err) => {
  console.log('Error!', err);
});
