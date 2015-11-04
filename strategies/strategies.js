var db = require('../models');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = {
  serializeUser: function(user, done) {
    done(null, user.id);
  },
  deserializeUser: function(id, done) {
    db.user.findById(id).then(function(user) {
      done(null, user.get());
    }).catch(done);
  },
  localStrategy: new LocalStrategy({
      usernameField: 'username'
    },
    function(username, password, done) {
      db.user.find({where: {username: username}}).then(function(user) {
        if(user) {
          user.checkPassword(password, function(err, result) {
            if(err) {
              return done(err);
            }
            if(result) {
              done(null, user.get());
            } else {
              done(null, false, {message: 'Invalid password'});
            }
          });
        } else {
          done(null, false, {message: 'Unknown user'});
        }
      });
  }),
  twitterStrategy: new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    db.provider.find({
      where: {
        pid: profile.id,
        type: profile.provider
      },
      include: [db.user]
    }).then(function(provider) {
      if(provider && provider.user) {
        provider.token = token;
        provider.save().then(function() {
          done(null, provider.user.get());
        });
      } else {
        var username = profile.username;
        db.user.findOrCreate({
          where: {username: username},
          defaults: {email: null}
        }).spread(function(user, created) {
          if(created) {
            user.createProvider({
              pid: profile.id,
              token: token,
              type: profile.provider
            }).then(function() {
              done(null, user.get());
            });
          } else {
            done(null, false, {message: 'This username already exists. Please login'});
          }
        });
      }
    });
  })
};

