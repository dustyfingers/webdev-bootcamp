var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))


// Campground.create(
//   {
//     name: 'Appledew River',
//     image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80',
//     description: 'A beautiful riverside site surrounded by apple orchards.'
//   }, (err, campground) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('NEWLY CREATED CAMPGROUND: ');
//     console.log(campground);
//   }
// });

app.get('/', (req, res) => {
  res.render('landing');
});


// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {campgrounds:allCampgrounds});
    }
  })
});

// CREATE = add new campground to DB
app.post('/campgrounds', (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };
  // add to campgrounds array create a new campground and save to db
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});


// NEW = show form to create new campground
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});


// SHOW = show individual campground
app.get('/campgrounds/:id', (req, res) => {
  // find campground with provided id
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      res.render('show', {campground: foundCampground});
    }
  });
  // render show template with that campground

});


app.listen(9898, () => {
  console.log('YelpCamp server has started!');
})
