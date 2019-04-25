var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Campground = require('../models/campground');
var middleware = require('../middleware');
var passport = require('passport');


// show user profile route
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      req.flash('error', 'Something went wrong...');
      return res.redirect('back');
    }
    Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
      if (err) {
        req.flash('error', 'Something went wrong...');
        return res.redirect('back');
      }
      res.render('users/show', { user: foundUser, campgrounds: campgrounds });
    });
  });
});


module.exports = router;
