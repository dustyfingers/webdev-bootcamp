let express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    Campground = require('../models/campground'),
    middleware = require('../middleware'),
    passport = require('passport');


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
