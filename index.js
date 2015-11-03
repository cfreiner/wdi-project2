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

//Server-side socket.io to emit tweets
io.on('connect', function(socket) {
  console.log('User connected');
  var stream = null;
  socket.on('location', function(newLocation) {
    if(stream) {
      stream.stop();
    }
    stream = twitter.stream('statuses/filter', { locations: newLocation.coords });
    stream.on('tweet', function(tweet) {
      console.log('Emitting tweet');
      socket.emit('tweets', tweet);
    });
  });
  socket.on('disconnect', function() {
    console.log('User disconnected');
    stream.stop();
  });
});

server.listen(port, function() {
  console.log('Listening on port ' + port);
});
