var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_app', { useNewUrlParser: true });


// define a generalized schema for cat in this app
//
var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String
});

// compiles data from above into a model that has a bunch of useful methods
//
var Cat = mongoose.model('Cat', catSchema);

// add a new cat to db the long way
//
// var george = new Cat({
//   name: 'george',
//   age: 11,
//   breed: 'scottish fold'
// });
//
//
// george.save((err, cat) => {
//   if (err) {
//     console.log('Something went wrong');
//   } else {
//     console.log('We just saved a cat to the database');
//     console.log(cat);
//   }
// });


// add a new cat to db the short way
//
Cat.create({
  name: 'artemis',
  age: 15,
  breed: 'scottish fold'
}, (err, cat) => {
  if (err) {
    console.log('THERE WAS AN ERROR');
  } else {
    console.log(cat);
  }
});


// retreive all cats from db and log to console
Cat.find({}, (err, cats) => {
  if(err){
    console.log('OH NO, ERROR');
    console.log(err);
  } else {
    console.log('ALL THE CATS');
    console.log(cats);
  }
})
