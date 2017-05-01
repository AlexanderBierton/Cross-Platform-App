var requestUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4pllhe-rp7ZgsM_a-WIvv3KyC07BL6oM&libraries=places'

var map;
var service;
var infowindow;
var placeID = [];
var favID = [];
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
  placeType = "taxi_stand";
  initmap();
});

$(document).on('pagecreate', '#favourites', function(){
  var favLength = localStorage.length;
  var favHtml = "<ul data-role='listview' id ='favList'>"
  for(i = 0; i < favLength; i++){
    favDet = localStorage.getItem(localStorage.key(i));
    tempFav = JSON.parse(localStorage.getItem(localStorage.key(i)));
    favHtml += "<li>";
    favHtml += "<a id='favListBtn')>"
    favHtml += "<h1>" + tempFav[1] + "</h1>";
    favHtml += "<p>"+tempFav[2]+"</p>";
    favHtml == "</a>"
    favHtml += "</li>";
    favID.push(favDet);
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


      var favCheck = JSON.parse(localStorage.getItem(localStorage.key(i)));

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
        if(place.opening_hours != undefined){
          if(place.opening_hours.open_now == true){
            result += "<a class='listBtnOpen' onclick='getDetails("+i+")' href='#about' data-transition='slide'>"
          } else {
            result += "<a class='listBtnClosed' onclick='getDetails("+i+")' href='#about' data-transition='slide'>"
          }
        } else {
          result += "<a class='listBtnUndefined' onclick='getDetails("+i+")' href='#about' data-transition='slide'>"
        }

        result += "<h1>" + place.name + "</h1>";
        result += "<p>"+place.vicinity+"</p>";
        result == "</a>"
        result += "</li>";

        placeID.push(place);

      }

      result += "</ul>";
      $("#results").html(result);
      $('#resList').listview().listview('refresh');

      plUndefined = document.getElementsByClassName("listBtnUndefined");
      plOpen = document.getElementsByClassName("listBtnOpen");
      plClosed = document.getElementsByClassName("listBtnClosed");
      plFav = document.getElementsByClassName("listBtnFav");
      console.log(plOpen.length)
      for(i = 0; i < plOpen.length; i++){
        plOpen[i].style.backgroundColor = "#5C8356";
      }
      for(i = 0; i < plClosed.length; i++){
        plClosed[i].style.backgroundColor = "#9A6569";
      }
      for(i = 0; i < plUndefined.length; i++){
        plUndefined[i].style.backgroundColor = "#485469";
      }
      for(i = 0; i < plFav.length; i++){
        plFav[i].style.backgroundColor = "#9E8B67";
      }
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
        document.getElementById("fav").style.background='#9A6569';
        console.log("Equal found");
        break;
      } else {
        console.log("No equal found");
        document.getElementById("fav").style.background='#5C8356';
      }
      console.log(tempData[0]);
    }
  } else {
    document.getElementById("fav").style.background='#5C8356';
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
    stat = "<h2>No Images Available</h2>"
    $("#placeImg").html(covImg);
    $("#galStatus").html(stat);
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
        clean = false;
        break;
      }
    }
    if (clean == true) {
      for(i = 0, len = len; i < len; i++){
          var tempName = localStorage.key(i);
          console.log(tempName);
          if(tempName == "Place "+(lenP)){
            lenP += 1;
            console.log(tempName + " - New - " + lenP);
            i = -1;
          }
      }
      console.log("Adding Data");
      var details = JSON.stringify([id, name, vicinity])
      console.log(JSON.stringify(details));
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
  $("#favResults").empty();
  localStorage.clear();
}

function closeFav() {
  location.reload(true);
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

function setupPush() {
  var push = PushNotification.init({
    "android": {
      "senderID": "226185701583"
    },
    "ios": {
      "sound": true,
      "alert": true,
      "badge": true,
      "categories": {
        "invite": {
          "yes": {
            "callback": "app.accept", "title": "Accept", "foreground": true, "destructive": false
          },
          "no": {
            "callback": "app.reject", "title": "Reject", "foreground": true, "destructive": false
          },
          "maybe": {
            "callback": "app.maybe", "title": "Maybe", "foreground": true, "destructive": false
          }
        },
        "delete": {
          "yes": {
            "callback": "app.doDelete", "title": "Delete", "foreground": true, "destructive": true
          },
          "no": {
            "callback": "app.cancel", "title": "Cancel", "foreground": true, "destructive": false
          }
        }
      }
    },
    "windows": {}
  });
  push.on('registration', function(data) {
    console.log("registration event: " + data.registrationId);
    var oldRegId = localStorage.getItem('registrationId');
    if (oldRegId !== data.registrationId) {
      // Save new registration ID
      localStorage.setItem('registrationId', data.registrationId);
      // Post registrationId to your app server as the value has changed
    }
  });
  push.on('error', function(e) {
    console.log("push error = " + e.message);
  });
  push.on('notification', function(data) {
    console.log('notification event');
    navigator.notification.alert(
      data.message, // message
      null, // callback
      data.title, // title
      'Ok' // buttonName
    );
  });
}//end function
