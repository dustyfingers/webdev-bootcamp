let dotenv = require('dotenv').config();

let express = require('express'),
    app = express(),
    port = 9898,
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    passportLocalMongoose = require('passport-local-mongoose'),
    bodyParser = require('body-parser'),
    Campground = require('./models/campground'),
    User = require('./models/user'),
    seedDB = require('./seeds');


// require route files
const campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index'),
      reviewRoutes = require('./routes/reviews'),
      userRoutes = require('./routes/users');


mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');
// // seed database with dummy data
// seedDB();


// passport config
app.use(require('express-session')({
  secret: process.env.PASSPORT_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});


app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/users', userRoutes);


app.listen(port, () => {
  console.log(`YelpCamp server has started on port ${port}!`);
})
