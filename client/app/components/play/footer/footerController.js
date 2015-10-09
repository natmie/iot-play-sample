
'use strict';

module.exports = function($scope, $http, MqttService) {

	$scope.deviceCount = -1;
	$scope.iotforg = '';

	MqttService.getCredentials(function(data){
		$scope.iotforg = data.org;
		console.log("ORG!!!! " + $scope.iotforg);
	});

	$scope.updateDeviceCount = function() {
		$http.get('/deviceCount').then(function(response){
			console.log(response.data.deviceCount);
			$scope.deviceCount = response.data.deviceCount;
		}, function(response) {
			console.err(response.statusText);
		});
	};

	$scope.updateDeviceCount();
	$scope.deviceUpdateInterval = setInterval($scope.updateDeviceCount, 10000);

	$scope.$on("$destroy", function() {
		clearInterval($scope.deviceUpdateInterval);
	});
};
