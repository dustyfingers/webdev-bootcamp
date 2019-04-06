var secretNumber = 4;

var guess = prompt('Guess a number between 1 and 10');

switch (secretNumber === Number(guess)) {
  case true:
    alert('You got it!');
    break;
  case false:
    alert('Not this time bozo! Try again...');
    break;
}
