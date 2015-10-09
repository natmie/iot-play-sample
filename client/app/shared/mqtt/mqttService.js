'use strict';

module.exports = function($resource) {

  var client = null;

  this.getCredentials = function(callback) {

    var iotService = $resource('/iot/credentials', null, {
      'getCredentials': {
        method: 'GET',
        isArray: false
      }
    });

    iotService.getCredentials(null,
      function(data) {
        callback(data);
      },
      function(error) {
        console.log(error);
      });

  };

  this.connect = function(deviceId, callback) {

    this.getCredentials(
      function(data) {
        var mqtt = require('mqtt');

        var connectOptions = {};
        connectOptions.username = data.apiKey;
        connectOptions.password = data.apiToken;
        connectOptions.clientId = "a:" + data.org + ":iotmkt" + Math.floor(Math.random() * 1000);

        client = mqtt.connect("mqtt://" + data.mqtt_host + ":" + data.mqtt_u_port, connectOptions);

        client.on('connect', function() {
          var topic = "iot-2/type/+/id/" + deviceId + "/evt/sensorData/fmt/json";
          console.log("Subscribe topic " + topic);
          client.subscribe(topic);
        });

        client.on('message', function(topic, message) {
          //console.log(message.toString());
          message = JSON.parse(message.toString());
          if (message.d) {
            message = message.d;
          }
          callback(message);
        });
      });
  };

  this.disconnect = function() {
    if (client) {
      client.end();
    }
  };

};
