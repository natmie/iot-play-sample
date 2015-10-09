'use strict';

require('./../playService');

module.exports = function($scope, $http, $state, PlayService) {


  $scope.message = 'Give us some info about your device';
  $scope.nameLabel = 'Device name';
  $scope.passwordLabel = 'Device password';
  $scope.emailLabel = 'Your email';

  $scope.deviceIdInput = PlayService.getDeviceId();
  $scope.passwordInput = PlayService.getPassword();
  $scope.emailInput = PlayService.getEmail();

  $scope.passwordInput1 = $scope.passwordInput.charAt(0);
  $scope.passwordInput2 = $scope.passwordInput.charAt(1);
  $scope.passwordInput3 = $scope.passwordInput.charAt(2);
  $scope.passwordInput4 = $scope.passwordInput.charAt(3);

  $scope.deviceInput = function() {
    PlayService.setDeviceId($scope.deviceIdInput);
    $scope.passwordInput = $scope.passwordInput1 + $scope.passwordInput2 + $scope.passwordInput3 + $scope.passwordInput4;
    PlayService.setPassword($scope.passwordInput);
    PlayService.setEmail($scope.emailInput);
    var dataObj = {
        typeId: "iot-phone",
        deviceId: $scope.deviceIdInput,
        password: "iot-phone"
    };
    $http.post('/createDevice', dataObj).then(function(response){
        console.log(response.data);
        $state.go("play.deviceData");
    }, function(response) {
        console.err(response.statusText);
    });
  };
};
