var person = {
  firstName: 'Elie',
  sayHi: function() {
    return 'Hi ' + this.firstName;
  },
  determineContext: function() {
    return this === person;
  }
}

var person2 = {
  firstName: 'Lou',
  sayHi: function() {
    return 'Hi ' + this.firstName;
  },
  determineContext: function() {
    return this === person;
  },
  dog: {
    firstName: 'Peanut',
    sayHello: function() {
      return 'Hello ' + this.firstName;
    },
    determineContext: function() {
      return this === person2;
    }
  }
}
