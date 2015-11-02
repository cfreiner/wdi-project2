var map = null;
var mapReady = false;
var socket = io();
var tweets = [];
var geocoder = new google.maps.Geocoder();

socket.on('connect', function() {
  console.log('Socket.io connection successful');
});

socket.on('tweets', function(tweet) {
  createInfoWindowFromTweet(tweet);
  console.log(tweet.place.place_type, tweet.place.full_name);
});

//Get the relevent lat/lng bounds for the Twitter API
//Take a goodle maps LatLngBounds object literal
function getTwitterBounds(googleBounds) {
  var sw = googleBoundsgetSouthWest();
  var ne = googleBounds.getNorthEast();
  return {
    coords: [
      sw.lng().toString(),
      sw.lat().toString(),
      ne.lng().toString(),
      ne.lat().toString()
    ]
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
        var bounds = getTwitterBounds(map.getBounds());
        // $.ajax({
        //   url: window.location + 'stream',
        //   method: 'GET',
        //   data: bounds
        // }).fail(function() {
        //   console.log('ajax failed');
        // });
        socket.emit('location', bounds);
      });

    });
  } else {
    console.log('geolocation not enabled');
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6, lng: -122.354},
    zoom: 14
  });
  }
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

//Pan the map to a new location
function panToLocation(location) {
  geocoder.geocode( { 'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.panToBounds(results[0].geometry.bounds);
    } else {
      alert("Google geocoding error: " + status);
    }
  });
}

var newYork = {coords: ['-74','40','-73','41']};

$(function() {
  $('.test').click(function(e) {
    e.preventDefault();
    socket.emit('location', newYork);
  });
  $('#btn-location').click(function(e) {
    e.preventDefault();
    var location = $('#btn-location').val();
    panToLocation(location);
    socket.emit('location', getTwitterBounds(map.getBounds));
  });
});
