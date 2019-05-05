let express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Review = require('../models/review'),
    middleware = require('../middleware'),
    NodeGeocoder = require('node-geocoder'),
    multer = require('multer'),
    cloudinary = require('cloudinary');
let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
let geocoder = NodeGeocoder(options);
let storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });

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
      let name = req.body.name;
      let price = req.body.price;
      let desc = req.body.description;
      let image = req.body.image;
      let imageId = req.body.imageId;
      let lat = data[0].latitude;
      let lng = data[0].longitude;
      let location = data[0].formattedAddress;
      let author = {
        id: req.user._id,
        username: req.user.username
      }

      let newCampground = { name: name, price: price, image: image, imageId: imageId, description: desc, author: author, location: location, lat: lat, lng: lng };
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
  Campground.findById(req.params.id).populate({
    path: 'reviews',
    options: {sort: {createdAt: -1}}
  }).exec((err, foundCampground) => {
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
router.put('/:id', middleware.checkCampgroundOwnership, upload.single('image'), (req, res) => {
  geocoder.geocode(req.body.campground.location, (err, data) => {
    if (err || !data.length) {
      req.flash('error', 'Invalid Address');
      return res.redirect('back');
    }
    delete req.body.campground.rating;
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    // find and update the correct campground
    Campground.findById(req.params.id, async (err, campground) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        if (req.file) {
          try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            let result = await cloudinary.v2.uploader.upload(req.file.path);
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
  Campground.findById(req.params.id, async (err, campground) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    try {
      await cloudinary.v2.uploader.destroy(campground.imageId);
      // deletes all reviews associated with the campground
      Review.remove({"_id": {$in: campground.reviews}}, function (err) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        //  delete the campground
        campground.remove();
        req.flash("success", "Campground deleted successfully!");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
  });
});


// regex function
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


module.exports = router;
