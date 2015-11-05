var map;

//Create the history map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(0, 0),
    //Zoom algorithm from Adam Thomas on Stack Overflow
    zoom: Math.ceil(Math.log2($('#map').width())) - 9
  });
  drawHistoryMarkers();
}

//Draw the user's history markers on the map
function drawHistoryMarkers() {
  if(data) {
    var service = new google.maps.places.PlacesService(map);
    data.forEach(function(item) {
      var request = {
        placeId: item.placeId
      };
      service.getDetails(request, function(place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          var infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
          });
        }
      })
    });
  }
}
