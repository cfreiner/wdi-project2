var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');

router.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (user) {
      req.login(user, function(err) {
        if (err) throw err;
        console.log("after login******************");
        console.log(req.user);
        console.log("******************");
        req.flash('success', 'Login successful!');
        res.redirect('/');
      });
    } else {
      req.flash('danger', 'Login Error');
      res.redirect('/');
    }
  })(req, res);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/');
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));

router.post('/signup', function(req, res) {
  if (req.body.signup_password != req.body.signup_password2) {
      req.flash('danger', 'Passwords must match! Try again!');
      res.redirect('/');
    } else {
      db.user.findOrCreate({
        where: {email: req.body.signup_email},
        defaults: {
          password: req.body.signup_password,
          username: req.body.signup_username
        }
      }).spread(function(user, created) {
        if (created) {
          req.login(user, function(err) {
            if (err) throw err;
            req.flash('success', 'Sign up successful!');
            res.redirect('/');
          });
        } else {
          req.flash('danger', 'A user with that email already exists!');
          res.redirect('/auth/signup');
        }
      }).catch(function(err) {
        req.flash('danger','Signup error: ' + err);
        res.redirect('/');
      });
    }
});

module.exports = router;
