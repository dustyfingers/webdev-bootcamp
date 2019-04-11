var mongoose = require('mongoose');


var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// super important!!
module.exports =  mongoose.model('Campground', campgroundSchema);
