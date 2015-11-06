var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');
var bcrypt = require('bcrypt');

//Currently unused route. Useful in the future to add passwords
//and emails to Twitter logins that don't have those fields
router.post('/update', function(req, res) {
  if(req.body.update_password !== req.body.update_password2) {
    req.flash('danger', 'Passwords must match');
    res.redirect('/');
  }
  if(req.user && !req.user.password && !req.user.email) {
    var password = null;
    bcrypt.hash(req.body.update_password, 10, function(err, hash) {
      if(err) {throw err;}
      password = hash;
    });
    db.user.findById(req.user.id).then(function(user) {
      user.update({
        email: req.body.email,
        password: password
      }).then(function(user) {
        req.flash('success', 'Successfully updated info for ' + user.username);
        res.redirect('/');
      });
    });
  } else {
    req.flash('danger', 'You must be logged in to update account info');
  }
});

//Login route
router.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    if (user) {
      req.login(user, function(err) {
        if (err) throw err;
        req.flash('success', 'Login successful!');
        res.redirect('/');
      });
    } else {
      req.flash('danger', 'Login Error');
      res.redirect('/');
    }
  })(req, res);
});

//Logout route
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/');
});

//Twitter OAuth route with callback route
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));
//Sign up/register route
router.post('/signup', function(req, res) {
  if (req.body.signup_password != req.body.signup_password2) {
      req.flash('danger', 'Passwords must match! Try again!');
      res.redirect('/');
    } else {
      db.user.findOrCreate({
        where: {username: req.body.signup_username},
        defaults: {
          password: req.body.signup_password,
          email: req.body.signup_email
        }
      }).spread(function(user, created) {
        if (created) {
          req.login(user, function(err) {
            if (err) throw err;
            req.flash('success', 'Sign up successful!');
            res.redirect('/');
          });
        } else {
          req.flash('danger', 'A user with that name already exists!');
          res.redirect('/auth/signup');
        }
      }).catch(function(err) {
        req.flash('danger','Signup error: ' + err);
        res.redirect('/');
      });
    }
});

module.exports = router;
