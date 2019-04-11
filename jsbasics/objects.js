// var person = {
//   name: 'Travis',
//   age: 21,
//   city: 'LA'
// }
// console.log(person['name']);
// // or
// console.log(person.name);
//
// person.city = 'London';
// person.age += 1;
//
// console.log(person);


// write code to retrieve 'Malfoy' from someObject
// Go one 'layer' at a time!
var someObject = {
  friends: [
    {name: 'Malfoy'},
    {name: 'Gilfoyle'},
    {name: 'Crabbe'}
  ],
  color: 'baby blue',
  isEvil: true
};

// nailed it?
var objName = someObject.friends[0].name;

console.log(objName);
