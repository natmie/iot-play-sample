'use strict';

require('./../playService');

module.exports = function($scope, LivePhoneDataService, $timeout, PlayService, SnipService) {

	var timeoutHandle = null;

	function setMobileUrl(paramDeviceId) {
		var mobileUrl = location.hostname;
		if (location.port) {
			mobileUrl = mobileUrl + ":" + location.port;
		}
		mobileUrl = mobileUrl + "/iotphone/device/" + paramDeviceId;

		SnipService.getShortURL(mobileUrl,
			function(data) {
				$scope.gotoUrl = data.url;
			},
			function(error) {
				console.log(error);
			}
		);
	}

	function generateDeviceId() {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 5; i = i + 1) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return "iotdevice" + text;
	}
	//If device has not been informed, generate one
	var deviceId = PlayService.getDeviceId();
	if (!deviceId) {
		deviceId = generateDeviceId();
	}

	$scope.deviceId = deviceId;

	$scope.message = 'Your data visualized';
	$scope.gotoLabel = 'Visit this URL on your smartphone to see live data: ';
	setMobileUrl(deviceId);

	$scope.vibrationChartMetaData = [{
		field: "accelMag",
		name: "Total Acceleration",
		shortName: "acceleration",
		unit: "m/s\u00B2;"
	}];

	$scope.vibrationAttributeRuleMetadata = $scope.vibrationChartMetaData[0];

	$scope.accelChartMetaData = [{
		field: "ax",
		name: "Accel X"
	}, {
		field: "ay",
		name: "Accel Y"
	}, {
		field: "az",
		name: "Accel Z"
	}];

	LivePhoneDataService.receiveLivePhoneData(deviceId, function(livePhoneData) {

		$scope.hideDeviceUrl = true;
		$scope.livePhoneData = livePhoneData;
		$scope.vibrationDataPoint = livePhoneData;
		$scope.accelDataPoint = livePhoneData;

		// Forces angular to run its digest cycle because LivePhoneDataService's callback is fired outside of the "angular world".
		$timeout(function() { $scope.$apply(); });

		// clear "inactive detection" timeout
		if (timeoutHandle) {
			$timeout.cancel(timeoutHandle);
		}

		// set "inactive detection" timeout
		timeoutHandle = $timeout(function() {
			$scope.hideDeviceUrl = false;
		}, 2000);
	});

	$scope.$on("$destroy", function() {
		LivePhoneDataService.stopReceivingLivePhoneData();
	});

	$scope.vibrationThreshold = 10;
	var attributeRule = document.querySelector('attribute-rule');
	attributeRule.addEventListener('attribute-limit-updated', function(e) {
		$scope.vibrationThreshold = e.detail.attributeLimit;
		// Forces angular to run its digest cycle because this event will be fired by a polymer element
		// which is outside of the "angular world".
		$timeout(function() { $scope.$apply(); });
	});
};
