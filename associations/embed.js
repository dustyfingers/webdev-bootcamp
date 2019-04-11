var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog_demo', { useNewUrlParser: true });

// POST - title, content - DB SCHEMA
var postSchema = new mongoose.Schema({
  title: String,
  content: String
});
var Post = mongoose.model('Post', postSchema);

// USER - email, name - DB SCHEMA
var userSchema = new mongoose.Schema( {
  email: String,
  name: String,
  posts: [postSchema]
});
var User = mongoose.model('User', userSchema);


// // create a new user
// var newUser = new User({
//   email: 'adam@apple.edu',
//   name: 'Adam Apple'
// });
// // push a post object to its posts array
// newUser.posts.push({
//   title: 'Blog Post 2',
//   content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 2'
// });
// // save the newUser object to the db
// newUser.save((err, user) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log(user);
//   }
// });

// var newPost = new Post({
//   title: 'Post 1',
//   content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
// });
//
// newPost.save((err, post) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });

User.findOne({name: 'Adam Apple'}, (err, user) => {
  if(err) {
    console.log(err);
  } else {
    user.posts.push({
      title: 'Blog Post 3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 3'
    });
    user.save((err, user) => {
      if(err) {
        console.log(err);
      }else {
        console.log(user);
      }
    });
  }
});
