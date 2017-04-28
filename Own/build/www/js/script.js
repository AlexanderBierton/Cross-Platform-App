var requestUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4pllhe-rp7ZgsM_a-WIvv3KyC07BL6oM&libraries=places'

var map;
var service;
var infowindow;
var placeID = [];
var placeType;

$(document).ready(function() {
  console.log('Ready');
});

document.addEventListener("deviceReady", function() {
  console.log('Device Ready');
});

$(document).on('click', '#bt1', function() {
  console.log("Btn1 click")
  placeType = 'bar'
  initmap();
});

$(document).on('click', '#bt2', function() {
  console.log("Btn2 click")
  placeType = 'night_club'
  initmap();
});

$(document).on('click', '#bt3', function() {
  console.log("Btn3 click")
  placeType = 'meal_takeaway'
  initmap();
});

$(document).on('click', '#bt4', function() {
  console.log("Btn4 click")
  initmap();
});



var placeList = function() {
  var html = ""
  html += "<div>"
}



function initmap() {
  var linc = {lat: 53.2280, lng: -0.546055};

  var map = new google.maps.Map($('#map'), {
      center: linc,
      zoom: 15
    });

  var request = {
    location: linc,
    radius: 500,
    types: [placeType]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status){
    if (status == google.maps.places.PlacesServiceStatus.OK) {

      var result ="<ul data-role='listview' id ='resList'>"

      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        if(place.photos != undefined && place.photos.length > 0) {
          var img = place.photos[0].getUrl({maxWidth:1000,maxHeight:1000})
        } else {
          var img = place.icon;
        }
        console.log(place);

        result += "<li>";
        result+= "<a id='listBtn' onclick='getDetails("+i+")' href='#about' data-transition='pop'>"
        result += "<h1>" + place.name + "</h1>";
        result += "<p>"+place.vicinity+"</p>";
        result == "</a>"
        result += "</li>";

        placeID.push(place);
      }

      result += "</ul>";
      $("#results").html(result);
      $('#resList').listview().listview('refresh');
    }
  })
}

function getDetails(pos){
  service.getDetails({ placeId: placeID[pos].place_id }, function(results, status){
    placeID[pos].details = results
    console.log(results)
  })
}

function removevar() {
  console.log("Bye");
  $("#results").empty();
  console.log(map);
}
