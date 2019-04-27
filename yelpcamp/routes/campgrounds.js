var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');
var multer = require('multer');
var cloudinary = require('cloudinary');
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);
var storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX - show all campgrounds
router.get('/', (req, res) => {
  if (req.query.search) {
    // regex for search query string
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // get all campgrounds from db
    Campground.find({ name: regex }, (err, allCampgrounds) => {
      if(err) {
        req.flash('error', 'Something went wrong.');
      } else {
        res.render('campgrounds/index', {campgrounds:allCampgrounds});
      }
    });
  } else {
    // get all campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
      if(err) {
        req.flash('error', 'Something went wrong.');
      } else {
        res.render('campgrounds/index', {campgrounds:allCampgrounds});
      }
    });
  }
});


// CREATE = add new campground to DB
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {

  geocoder.geocode(req.body.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid Address');
      return res.redirect('back');
    }

    cloudinary.uploader.upload(req.file.path, (result) => {
      req.body.image = result.secure_url;
      // get data from form
      var name = req.body.name;
      var price = req.body.price;
      var desc = req.body.description;
      var image = req.body.image;
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;
      var author = {
        id: req.user._id,
        username: req.user.username
      }
      var newCampground = { name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng };
      // eval(require('locus'));
      console.log(req.body.image);
      // add to campgrounds array create a new campground and save to db
      Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/campgrounds/' + newlyCreated._id);
        }
      });
    });

  });
});


// NEW = show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});


// update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  geocoder.geocode(req.body.campground.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid Address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    var newData = { name: req.body.campground.name, price: req.body.campground.price, image: req.body.campground.image, description: req.body.campground.description };
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully Updated!')
        res.redirect('/campgrounds/' + req.params.id);
      }
    });
  });
});


// destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground successfully deleted.');
      res.redirect('/campgrounds');
    }
  });
});


// regex function
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


module.exports = router;
