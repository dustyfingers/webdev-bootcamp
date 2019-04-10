var express = require('express'),
    methodOverride = require('method-override'),
    app = express(),
    port = 5665,
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');


// APP CONFIG
mongoose.connect('mongodb://localhost/blog-app', {useNewUrlParser: true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));


// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);


// // test data
// Blog.create({
//   title: 'Blog Post 1',
//   image: 'https://images.unsplash.com/photo-1551275073-f8adef647c1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1047&q=80',
//   body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
// });


// RESTful ROUTES!!!

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', (req, res) => {
  // create blog Post
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new');
    } else {
      // redirect to index
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      redirect('index');
    } else {
      res.render('show', { blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })
});

// setup app to listen on a certain port
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
