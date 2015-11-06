var express = require('express');
var router = express.Router();
var db = require('../models');

//Route to add a location to the user's history
router.post('/', function(req, res) {
  if(req.user) {
    db.user.findById(req.user.id).then(function(user) {
      db.history.findOrCreate({
        where: {
          userId: user.id,
          placeId: req.body.placeId
        }
      }).spread(function(history, created) {
        if(created) {
          console.log('created history entry');
          res.sendStatus(200);
        } else {
          console.log('not creating duplicate history');
          res.sendStatus(200);
        }
      });
    });
  } else {
    console.log('Place not logged to history because no user was logged in.');
  }
});

//Show history route
router.get('/', function(req, res) {
  if(req.user) {
    db.user.findById(req.user.id).then(function(user) {
      user.getHistories().then(function(histories) {
        res.render('history', {histories: histories});
      });
    });
  } else {
    req.flash('danger', 'Must be logged in to view history');
    res.redirect('/');
  }
});

module.exports = router;
