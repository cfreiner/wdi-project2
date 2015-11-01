var map;
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
    });
  } else {
    console.log('geolocation not enabled');
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.6, lng: -122.354},
    zoom: 14
  });
  }
}


