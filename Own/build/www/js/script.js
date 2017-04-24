var requestUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA4pllhe-rp7ZgsM_a-WIvv3KyC07BL6oM&libraries=places'

$(document).ready(function() {
  console.log('Ready');
});

document.addEventListener("deviceReady", function() {
  console.log('Device Ready');
});

$(document).on('click', '#bt1', function() {
  console.log('Handler for .click() called.');
});

$(document).on('pagecreate', '#placeList',function(){
  $.getJSON(requestUrl, function(data) {
    console.log(data);
  });

});
