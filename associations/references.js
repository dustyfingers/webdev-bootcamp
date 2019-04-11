var Post = require('./models/post');
var User = require('./models/user');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo_2', { useNewUrlParser: true });


// User.create({
//   email: 'bobtheassailant@gmail.com',
//   name: 'Louie Williford'
// });


// Post.create({
//   title: 'How to cook a good burger part 4',
//   content: 'blah blah blah blah blah blah asgsdfhdfjfgjdfj blah blah blah blah blah blah blah blah blah blah blah blah blah blah...'
// }, (err, post) => {
//   User.findOne({email: 'bobtheassailant@gmail.com'}, (err, foundUser) => {
//     if(err) {
//       console.log(err);
//     } else {
//       foundUser.posts.push(post);
//       foundUser.save((err, data) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(data);
//         }
//       });
//     }
//   });
// });




// // find user & find all posts for that user
// User.findOne({email: 'bobtheassailant@gmail.com'}).populate('posts').exec((err, user) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });
