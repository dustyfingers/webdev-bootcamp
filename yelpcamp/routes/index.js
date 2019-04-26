var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var middleware = require('../middleware');


// root route
router.get('/', (req, res) => {
  res.render('landing');
});


// register form
router.get('/register', (req, res) => {
  res.render('register');
});


// handle user sign up and initial log in
router.post('/register', (req, res) => {
  var newUser = new User(
    {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: req.body.avatar,
      email: req.body.email
    });
  if (req.body.adminCode === 'secretCode123') {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to YelpCamp, ' + user.username + '.');
      res.redirect('/campgrounds');
    });
  });
});


// show login form
router.get('/login', (req, res) => {
  res.render('login');
});


// callback isnt need here, it was just to show that the passport method is middleware
// app.post('/login', passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/login'}), (req, res) => {});
router.post('/login', passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/login'}));


// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out.');
  res.redirect('/campgrounds');
});


// forgot password routes
router.get('/forgot', (req, res) => {
  res.render('forgot');
});


router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email exists.');
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1hr

        user.save((err) => done(err, token, user));
      });
    },
    (token, user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'bobtheassailant@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bobtheassailant@gmail.com',
        subject: 'YelpCamp password reset',
        text: 'You are receiving this because you (or someone else) have requested to reset your password. ' +
              'Please follow the following link to complete the password reset. ' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              ' If you did not request this, please ignore this email and your password will remain unchanged.'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'An email has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
      res.redirect('/forgot');
    }
  });
});


router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', { token: req.params.token });
  });
});


router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, (err) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    (user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'bobtheassailant@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bobtheassailant@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], (err) => {
    res.redirect('/campgrounds');
  });
});

module.exports = router;
