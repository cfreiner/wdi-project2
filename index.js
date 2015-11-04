var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var db = require('./models');
var passport = require('passport');
var app = express();
var server = require('http').createServer(app);
var strategies = require('./strategies/strategies');

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: 'q3oR9uSdx29g73pSnr894jfwDEshd8',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);
passport.use(strategies.localStrategy);
passport.use(strategies.twitterStrategy);

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

//Twitter streaming variables
var io = require('socket.io')(server);
var Twit = require('twit');
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//Routing
app.get('/', function(req, res) {
  console.log("******************");
  console.log(req.user);
  console.log("******************");
  res.render('index');
});

app.get('/test', function(req, res) {
  if (req.user) {
    req.flash('success', 'You are logged in via passport');
    res.redirect('/');
  } else {
    req.flash('danger','Something messed up');
    res.redirect('/');
  }
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

var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Listening on port ' + port);
});
