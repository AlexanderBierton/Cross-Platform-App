var requestUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4pllhe-rp7ZgsM_a-WIvv3KyC07BL6oM&libraries=places'

var map;
var service;
var infowindow;
var placeID = [];
var placeType;

var pd
var pn
var pv

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

$(document).on('pagecreate', '#favourites', function(){
  var favLength = localStorage.length;
  var favHtml = "<ul data-role='listview' id ='favList'>"
  for(i = 0; i < favLength; i++){
    tempFav = JSON.parse(localStorage.getItem(localStorage.key(i)));
    favHtml += "<li>";
    favHtml += "<a id='favListBtn'>"
    favHtml += "<h1>" + tempFav[1] + "</h1>";
    favHtml += "<p>"+tempFav[2]+"</p>";
    favHtml == "</a>"
    favHtml += "</li>";
  }
  favHtml += "</ul>";
  $("#favResults").html(favHtml);
  $("#favList").listview().listview('refresh');
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
        //console.log(place);

        result += "<li>";
        result += "<a id='listBtn' onclick='getDetails("+i+")' href='#about' data-transition='slide'>"
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
    placeID[pos].details = results;
    parseDetails(results);

  })
}

$(document).on('pagecreate', '#about', function() {
  $(document).on("click", "#fav", function() {
    console.log(pd, pn, pv);
    favourite(pd, pn, pv);
  });
});


function parseDetails(data){
  //console.log(data);
  dataLength = localStorage.length;
  console.log("-------New page-------")
  console.log("Length of Data: " + dataLength);
  pd = data.id;
  pn = data.name;
  pv = data.vicinity;
  console.log(pd, pn, pv);

  if (dataLength != 0) {
    for(i = 0, len = localStorage.length; i < len; i++){
      var tempData = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if(tempData[0] == data.id){
        document.getElementById("fav").style.background='Red';
        console.log("Equal found");
        break;
      } else {
        console.log("No equal found");
        document.getElementById("fav").style.background='Green';
      }
      console.log(tempData[0]);
    }
  } else {
    document.getElementById("fav").style.background='Green';
  }

  if(data.photos != undefined) {
    var covImg = data.photos[0].getUrl({maxWidth: 1000, maxHeight: 1000});
    disImg = "<img id='coverImg' src='"+covImg+"' />";
    $("#placeImg").html(disImg);

    var gall = "";
    var stat = "<h2>Gallery</h2>"
    var phts = data.photos;
    for(i = 0; i < phts.length; i++){
      var galImg = data.photos[i].getUrl({maxWidth: 250, maxHeight: 250});
      gall += "<div class='gallHolder'><img class='gallery' href='#img"+i+"' src='"+galImg+"' /></div>"
    }
    $("#galStatus").html(stat);
    $("#Gallery").html(gall);

  } else {
    covImg = "<h3 id='imgMessage'>No Image Availble</h3>"
    $("#placeImg").html(disImg);
  }

  if (data.rating != undefined) {
    var score = data.rating;
    plScore = "<h2>Rated: "+score+"/5</h2>";
    $("#rating").html(plScore);
  } else {
    plScore = "<h2>No Rating Available</h2>";
    $("#rating").html(plScore);
  }

  if(data.geometry.location.lat != undefined && data.geometry.location.lng != undefined){
    lt = data.geometry.location.lat();
    ln = data.geometry.location.lng();

    plLtLn = "<a onclick='openMaps("+lt+","+ln+")'><div id='dirBtn' data-icon='navigation' data-iconpos='right'>Directions</div></a>"
    $("#directions").html(plLtLn);
    $("#dirBtn").button().button('refresh')
  } else {
    plLtLn = "<h3>No location available available</h3>"
    $("#directions").html(plLtLn);
  }

  if(data.formatted_phone_number != undefined){
    var number = data.formatted_phone_number;
    plNum = "<a href='tel:"+number+"'><div id='phoneBut' data-icon='phone' data-iconpos='right'>Phone</div></a>"
    $("#phone").html(plNum);
    $("#phoneBut").button().button('refresh')
  } else {
    plNum = "<h3>No Number available</h3>"
    $("#phone").html(plNum);
  }

  var title = data.name;
  plTitle = "<h1>"+title+"</h1>"
  $("#placeTitle").html(plTitle);

  var add = "<h3>"+data.vicinity+"</h3>";
  $("#address").html(add);



}



function favourite(id, name, vicinity) {
  console.log(id, name, vicinity);
  //localStorage.clear();

  var len = localStorage.length;
  var lenP = (len + 1);
  console.log("Length: " + len + " Length Plus: " +lenP);


  var clean = true;
  if(len != 0){
    for(i = 0, len = len; i < len; i++){
      var tempData = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if(tempData[0] == id){
        console.log("Removing Data");
        localStorage.removeItem(localStorage.key(i));
        document.getElementById("fav").style.background='Green';
        fvtd = false;
        clean = false;
        break;
      }
    }
    if (clean == true) {
      console.log("Adding Data");
      var details = JSON.stringify([id, name, vicinity])
      localStorage.setItem("Place "+(lenP), details);
      document.getElementById("fav").style.background='Red';
    }
  } else {
    console.log("Adding Data 2");
    var details = JSON.stringify([id, name, vicinity])
    localStorage.setItem("Place "+(lenP), details);
    document.getElementById("fav").style.background='Red';
  }



  for(i = 0, len = localStorage.length; i < len; i++){
    var tempData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    console.log(tempData);
  }

  clean = true
  console.log("Length of Data: " + localStorage.length);
}

function DeleteFavourites() {
  console.log("Deleting...");
  localStorage.clear();
}


function backList(){
  $("#placeImg").empty();
  $("#placeTitle").empty();
  $("#rating").empty();
  $("#address").empty();
  $("#directions").empty();
  $("#phone").empty();
  $("#galStatus").empty();
  $("#Gallery").empty();
}

function openMaps(lat, long) {
  window.open('http://maps.google.com?daddr=' + lat + ',' + long + '&amp;ll=');
}

function removevar() {
  console.log("Bye");
  $("#results").empty();
  location.reload(true);
}
