var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/', function(req, res) {
  if(req.user) {
    db.user.findById(req.user.id).then(function(user) {
      user.createHistory({
        placeId: req.body.data.placeId
      }).then(function(history) {
        console.log('Created history for place ' + history.placeId);
      });
    });
  } else {
    console.log('Place not logged to history because no user was logged in.');
  }
});

router.get('/', function(req, res) {
  if(req.user) {
    db.user.findById(req.user.id).then(function(user) {
      user.getHistory().then(function(histories) {
        res.render('history', {histories: histories});
      });
    });
  } else {
    req.flash('danger', 'Must be logged in to view history');
    res.redirect('/');
  }
});
