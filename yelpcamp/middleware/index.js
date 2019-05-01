var Campground = require('../models/campground');
var Review = require('../models/review');


// middleware goes here
let middlewareObj = {};


middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Campground not found...');
        res.redirect('back');
      } else {
        // does user own campground?
        if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          req.flash('error', "Permission denied");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You dont have permissions to do that.');
    res.redirect('back');
  }
}


middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, (err, foundReview) => {
      if (err) {
        req.flash('error', 'There was a problem...');
        res.redirect('back');
      } else {
        if (foundReview.author.id.equals(req.user._id)) {
            next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
}


middlewareObj.checkReviewExistence = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id).populate("reviews").exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                var foundUserReview = foundCampground.reviews.some((review) => {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/campgrounds/" + foundCampground._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};


module.exports = middlewareObj;
