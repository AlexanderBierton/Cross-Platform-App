document.addEventListener("deviceready", function (){
  console.log('Device Ready');
  setupPush();
});


function setupPush() {
  var push = PushNotification.init({
    "android": {
      "senderID": "496970038161"
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
