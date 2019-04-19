var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');


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
      req.flash('error', err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to YelpCamp!' + user.username);
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
  req.flash('success', 'Logged you out.');
  res.redirect('/campgrounds');
});


module.exports = router;
