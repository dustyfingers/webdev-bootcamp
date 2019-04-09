var colors = ['red', 'magenta', 'green', 'blue', 'yellow'];

// add/remove to end of array
//
colors.push('violet');
console.log(colors);
colors.pop();
console.log(colors);

// add/remove to beginning of array
//
colors.unshift('perriwinkle');
console.log(colors);
colors.shift();
console.log(colors);

var nums = [34, 54, 22];
nums.unshift('HELLO');
console.log(nums);
nums.shift();
console.log(nums);


// indexOf() is really useful!
//
var friends = ['Charlie', 'Liz', 'David', 'Mattias', 'Liz'];

friends.indexOf('David');//returns the index at which the string 'Dave' can be found, 2
friends.indexOf('Liz');//returns the index at which the string 'Liz' can be found, 1 NOT 4!
// returns -1 if the element is not present
friends.indexOf('Herman');//returns -1



// slice things out of/copy arrays
//
var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
// use slice to copy the 2nd and 3rd fruits
// specify index where the new array starts and friends
var citrus = fruits.slice(1, 3); // .slice(start, end)
// this does not alter the original fruits array
console.log(citrus);
console.log(fruits);
// you can also use slice() to copy an entire array!!
var nums = [1, 2, 3, 4];
var otherNums = nums.slice();
// both arrays are [1,2, 3, 4]
