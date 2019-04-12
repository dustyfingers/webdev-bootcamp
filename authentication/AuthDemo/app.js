var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user');

mongoose.connect('mongodb://localhost/auth_demo_app',{ useNewUrlParser: true });


// APP CONFIG
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
  secret: 'franco apple xzx4 cc3p cdg4',
  resave: false,
  saveUninitialized: false
}));
// sets passport up to work in our app
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// ===================================================================
// ROUTES

// index route
app.get('/', (req, res) => {
  res.render('home');
});

// secret route
app.get('/secret', (req, res) => {
  res.render('secret');
});


/////////////////
// Auth routes

// show sign in form
app.get('/register', (req, res) => {
  res.render('register');
});

// handling user sign up & initial log in
app.post('/register', (req, res) => {
  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/secret');
    });
  });
});

// login routes
// render login form
app.get('/login', (req, res) => {
  res.render('login');
});

// handling user login
// middleware
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}), (req, res) => {

});























app.listen(5675, () => {
  console.log('Server started on port 5675');
});
