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


// NEW = show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});


// CREATE = add new campground to DB
router.post('/', middleware.isLoggedIn, upload.single('image'), (req, res) => {
  geocoder.geocode(req.body.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid Address');
      return res.redirect('back');
    }
    cloudinary.uploader.upload(req.file.path, (result) => {
      if (err) {
        req.flash('error', 'There was a problem uploading your image...');
        return res.redirect('back');
      }
      req.body.image = result.secure_url;
      req.body.imageId = result.public_id;
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
      // add to campgrounds array create a new campground and save to db
      Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
          req.flash('error', 'There was a problem creating your campground...');
        } else {
          res.redirect('/campgrounds/' + newlyCreated._id);
        }
      });
    });
  });
});


// show campground route
router.get('/:id', (req, res) => {
  // find campground with provided id
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
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


// edit campground post route
router.put('/:id', middleware.checkCampgroundOwnership, upload.single('image'), async function(req, res) {
  geocoder.geocode(req.body.campground.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid Address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    // find and update the correct campground
    Campground.findById(req.params.id, async function(err, campground) {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        if (req.file) {
          console.log('There is a file to upload.');
          console.log(req.file.path);
          try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            let result = await cloudinary.v2.uploader.upload(req.file.path);
            console.log(result);
            eval(require('locus'));
            campground.imageId = result.public_id;
            campground.image = result.secure_url;
          } catch (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
        }
        campground.name = req.body.campground.name;
        campground.description = req.body.campground.description;
        campground.save();
        req.flash('success', 'Successfully Updated!');
        res.redirect('/campgrounds/' + campground._id);
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
