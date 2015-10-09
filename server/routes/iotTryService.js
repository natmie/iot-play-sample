(function() {
	'use strict';

	var express = require('express'),
		bmServices = require('../services/services'),
		router = express.Router();

	router.get('/credentials', function(req, res) {
		//Get IoT Foundation credentials
		var credentials = bmServices.getIoTService('discover-iot-try-service');
		res.send(JSON.stringify(credentials));
	});

	module.exports = router;
}());
