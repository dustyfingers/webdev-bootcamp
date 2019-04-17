var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');


// INDEX - show all campgrounds
router.get('/', (req, res) => {
  // get all campgrounds from db
  Campground.find({}, (err, allCampgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds:allCampgrounds});
    }
  })
});


// CREATE = add new campground to DB
router.post('/', isLoggedIn, (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = { name: name, image: image, description: desc, author: author };
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
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});


// SHOW = show individual campground
router.get('/:id', (req, res) => {
  // find campground with provided id
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});


// edit campground route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});


// update campground route
router.put('/:id', checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


// destroy campground route
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove( req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});


// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


// checkCampgroundOwnership middleware
function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own campground?
        console.log(foundCampground);
        console.log(foundCampground.author.id);
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}


module.exports = router;
