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

//Misc middleware
app.use(express.static(__dirname + '/static'));
app.set('view engine', 'jade');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
var flash = require('connect-flash');
app.use(flash());

//Session middleware
var session = require('express-session');
app.use(session({
  secret: 'q3oR9uSdx29g73pSnr894jfwDEshd8',
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next) {
  if(req.session.user) {
    db.user.findById(req.session.user).then(function(user) {
      if(user) {
        req.currentUser = user;
        next();
      } else {
        req.currentUser = false;
        next();
      }
    });
  } else {
    req.currentUser = false;
    next();
  }
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.currentUser;
  res.locals.alerts = req.flash();
  next();
});

//Routing
app.route('/')
  .get(function(req, res) {
    res.render('index');
  });

app.use('/auth', require('./controllers/auth'));


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
