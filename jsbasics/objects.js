var person = {
  name: 'Travis',
  age: 21,
  city: 'LA'
}
console.log(person['name']);
// or
console.log(person.name);

person.city = 'London';
person.age += 1;

console.log(person);
