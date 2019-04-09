var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();


mongoose.connect('mongodb://localhost/yelp_camp')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))


// schema setup
//
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model('Campground', campgroundSchema);
//
// Campground.create({name: 'Appledew River', image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80'}, (err, campground) => {
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


app.get('/campgrounds', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds', {campgrounds:allCampgrounds});
    }
  })
  // res.render('campgrounds', {campgrounds: campgrounds});
});


app.post('/campgrounds', (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image};
  // add to campgrounds array create a new campground and save to db
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds' );
    }
  });
});


app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});


app.listen(5656, () => {
  console.log('YelpCamp server has started!');
})
