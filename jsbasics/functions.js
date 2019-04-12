function isEven(num) {
  if (num % 2 === 0) {
    return true;
  } else {
    return false;
  }
}
console.log(isEven(6));


function factorial(num) {
  // define a result
  var result = 1;
  // calculate factorial and store in result
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  // return result variable
  return result;
}
console.log(factorial(10));


function kebabToSnake(str) {
  var newStr = str.replace(/-/g, '_');
  return newStr;
}

console.log(kebabToSnake('i-love-snakes'));
