var map = null;
var mapReady = false;
var socket = io();
var tweets = [];

socket.on('connect', function() {
  console.log('Socket.io connection successful');
});

socket.on('tweets', function(tweet) {
  createInfoWindowFromTweet(tweet);
  console.log(tweet.place);
});

//Get the relevent lat/lng bounds for the Twitter API
function getTwitterBounds(map) {
  var bounds = map.getBounds();
  var sw = bounds.getSouthWest();
  var ne = bounds.getNorthEast();
  return {
    swLat: sw.lat(),
    swLng: sw.lng(),
    neLat: ne.lat(),
    neLng: ne.lng()
  };
}

function initMap() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 15
      });
      google.maps.event.addListenerOnce(map, 'idle', function(){
        mapReady = true;
        var bounds = getTwitterBounds(map);
        $.ajax({
          url: window.location + 'stream',
          method: 'GET',
          data: bounds
        }).fail(function() {
          console.log('ajax failed');
        });
      });

    });
  } else {
    console.log('geolocation not enabled');
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6, lng: -122.354},
    zoom: 14
  });
  }
  // $.ajax({
  //   url: window.location + 'stream/50/100',
  //   method: 'GET'
  // }).done(function() {
  //   console.log('ajax done');
  // }).fail(function() {
  //   console.log('ajax fail');
  // });
}

//Add a tweet to the array
function addTweet(tweet) {
  if(tweets.length < 10) {
    tweets.push(tweet);
  } else {
    tweets.shift();
    tweets.push(tweet);
  }
}

function createInfoWindowFromTweet(tweet) {
  if(mapReady && tweet.coordinates) {
    console.log('creating info window');
    var infoWindow = new google.maps.InfoWindow({
      content: tweet.text,
      position: {
        lat: tweet.coordinates.coordinates[1],
        lng: tweet.coordinates.coordinates[0]
      }
    });
    infoWindow.open(map);
  }
}

var infoWindow;

setTimeout(function() {
  infoWindow = new google.maps.InfoWindow({
    content: 'This info window is a test.',
    position: {
      lat: 47.768248,
      lng: -122.323113
    }
  });
  console.log('timeout');
}, 5000);


$(function() {
  $('.test').click(function(e) {
    e.preventDefault();
    infoWindow.open(map);
  });
});
