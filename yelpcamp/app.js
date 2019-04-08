var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var campgrounds = [
  {name: 'Sandy Valley', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Appledew River', image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80'},
  {name: 'Sandy Valley', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Appledew River', image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80'},
  {name: 'Sandy Valley', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'},
  {name: 'Appledew River', image: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80'}
];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', (req, res) => {
  res.render('landing');
});


app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {campgrounds: campgrounds});
});


app.post('/campgrounds', (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image};
  // add to campgrounds array
  campgrounds.push(newCampground);
  // redirect to campgrounds get route
  res.redirect('/campgrounds');
});


app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});


app.listen(5656, () => {
  console.log('YelpCamp server has started!');
})
