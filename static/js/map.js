var map = null;
var geocoder = null;
var mapReady = false;
var socket = io();

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
  var sw = googleBounds.getSouthWest();
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
  // geocoder = new google.maps.Geocoder();
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
        socket.emit('location', bounds);
      });

      //Map search bar and listener
      var input = document.getElementById('location');
      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        socket.emit('location', getTwitterBounds(map.getBounds()));
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

function createInfoWindowFromTweet(tweet) {
  if(mapReady && tweet.coordinates) {
    var lat = tweet.coordinates.coordinates[1];
    var lng = tweet.coordinates.coordinates[0];
    var googLatLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    if(map.getBounds().contains(googLatLng)) {
      console.log('creating info window');
      var infoWindow = new google.maps.InfoWindow({
        content: tweet.text,
        position: {
          lat: lat,
          lng: lng
        }
      });
      infoWindow.open(map);
    }
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

$(function() {
  $('.test').click(function(e) {
    e.preventDefault();
    var newYork = {coords: ['-74','40','-73','41']};
    socket.emit('location', newYork);
  });
  $('#btn-location').click(function(e) {
    e.preventDefault();
    var location = $('#btn-location').val();
    panToLocation(location);
    socket.emit('location', getTwitterBounds(map.getBounds));
  });
});
