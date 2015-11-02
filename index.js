//Server variables
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

//Twitter streaming variables
var io = require('socket.io')(server);
var Twit = require('twit');
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//Routing and views
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'jade');

app.route('/')
  .get(function(req, res) {
    res.render('index');
  });

app.get('/stream', function(req, res) {
  console.log(
    typeof req.query.swLng,
    req.query.swLat,
    req.query.neLng,
    req.query.neLat
  );
  switchStream(
    req.query.swLng,
    req.query.swLat,
    req.query.neLng,
    req.query.neLat
  );
  res.end();
});

var switchStream = function(swLng, swLat, neLng, neLat) {
  console.log('Switching stream');
  var location = [swLng, swLat, neLng, neLat];
  // stream.stop();
  stream = twitter.stream('statuses/filter', {locations: location});
};

//location bounds: SW first, NE second
var seattle = ['-122.354','47.6','-122.32','47.63'];

//Create stream
var stream = twitter.stream('statuses/filter', { locations: seattle });

//Server-side socket.io to emit tweets
io.on('connect', function(socket) {
  stream.on('tweet', function(tweet) {
    console.log('Emitting tweet');
    io.emit('tweets', tweet);
  });
});

server.listen(port, function() {
  console.log('Listening on port ' + port);
});
