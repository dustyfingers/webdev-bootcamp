var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


// root route
router.get('/', (req, res) => {
  res.render('landing');
});


// register form
router.get('/register', (req, res) => {
  res.render('register');
});


// handle user sign up and initial log in
router.post('/register', (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});


// show login form
router.get('/login', (req, res) => {
  res.render('login');
});


// callback isnt need here, it was just to show that the passport method is middleware
// app.post('/login', passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/login'}), (req, res) => {});
router.post('/login', passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/login'}));


// logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});


// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = router;
