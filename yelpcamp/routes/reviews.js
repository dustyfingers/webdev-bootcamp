var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Review = require("../models/review");
var middleware = require("../middleware");


// Reviews index route
router.get('/', (req, res) => {
  Campground.findById(req.params.id).populate({
    path: 'reviews',
    options: {sort: {createdAt: -1}}
  }).exec((err, campground) => {
    if (err || !campground) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.render('reviews/index', { campground: campground });
  })
});


// Reviews new route
router.get('/new', middleware.isLoggedIn, middleware.checkReviewExistence, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err || !campground) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.render('reviews/new', {campground: campground});
  });
});


// Reviews create route
router.post('/', middleware.isLoggedIn, middleware.checkReviewExistence, (req, res) => {
  Campground.findById(req.params.id).populate('reviews').exec((err, campground) => {
    if (err || !campground) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Review.create(req.body.review, (err, review) => {
      review.author.id = req.user._id;
      review.author.username = req.user.username;
      review.campground = campground;
      review.save();
      campground.reviews.push(review);
      campground.rating = calculateAverage(campground.reviews);
      campground.save();
      req.flash('success', 'Your review was successfully added.');
      res.redirect('/campgrounds/' + campground._id);
    });
  });
});


// Reviews edit route
router.get('/:review_id/edit', middleware.checkReviewOwnership, (req, res) => {
  Review.findById(req.params.review_id, (err, foundReview) => {
    if (err || !foundReview) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.render('reviews/edit', {campground_id: req.params.id, review: foundReview});
  });
});


// Reviews update route
router.put('/:review_id', middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, (err, updatedReview) => {
    if (err || !updatedReview) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Campground.findById(req.params.id).populate('reviews').exec((err, campground) => {
      if (err || !campground) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      campground.rating = calculateAverage(campground.reviews);
      campground.save();
      req.flash('success', 'Your review was successfully edited.');
      res.redirect('/campgrounds/' + req.params.id);
    });
  });
});


// Reviews delete route
router.delete('/:review_id', middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndRemove(req.params.review_id, (err) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    Campground.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate('reviews').exec((err, campground) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      campground.rating = calculateAverage(campground.reviews);
      campground.save();
      req.flash('success', 'Your review was successfully deleted.');
      res.redirect('/campgrounds/' + req.params.id);
    });
  });
});


// func to calculate the average rating of a campground
function calculateAverage(reviews) {
  if (reviews.length === 0) {
    return 0;
  }
  let sum = 0;
  reviews.forEach((element) => {
    sum += element.rating;
  });
  return sum / reviews.length;
}

module.exports = router;
