var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/login', function(req, res) {
  db.user.authenticate(
    req.body.login_email,
    req.body.login_password,
    function(err, user) {
      if(err) {
        res.send(err);
      } else if(user) {
        req.session.user = user.id;
        req.flash('success', 'You are logged in as ' + user.username);
        res.redirect('/');
      } else {
        req.flash('danger', 'Invalid username or password');
        res.redirect('/auth/login');
      }
    }
  );
});

router.get('/logout', function(req, res) {
  req.flash('success', 'You have been logged out');
  req.session.user = false;
  res.redirect('/');
});

router.post('/signup', function(req, res) {
  if(req.body.signup_password !== req.body.signup_password2) {
    req.flash('error', 'Passwords must match! Please try again.');
    res.redirect('/');
  } else {
    db.user.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
      }
    }).spread(function(user, created) {
      if(created) {
        req.flash('success', 'Registration successful!');
        res.redirect('/');
      } else {
        req.flash('danger', 'An account with that email already exists!');
        res.redirect('/');
      }
    }).catch(function(err) {
      req.flash('error', 'Error signing up: ' + err.message);
      res.redirect('/');
    });
  }
});

module.exports = router;
