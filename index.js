'use strict';

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/static'));
app.set('view engine', 'jade');

app.route('/')
  .get(function(req, res) {
    res.render('index');
  });

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
