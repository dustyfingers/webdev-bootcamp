var Campground = require('../models/campground');
var Comment = require('../models/comment');


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


middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'You dont have permission to do that.');
        res.redirect('back');
      } else {
        // does user own the comment?
        if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.flash('error', 'You need to be logged in to do that.')
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


module.exports = middlewareObj;
