var express               = require('express'),
    app                   = express();
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user');

mongoose.connect('mongodb://localhost/auth_demo_app',{ useNewUrlParser: true });


// APP CONFIG
app.set('view engine', 'ejs');
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

// ROUTES
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret', (req, res) => {
  res.render('secret');
});


app.listen(5675, () => {
  console.log('Server started on port 5675');
});
