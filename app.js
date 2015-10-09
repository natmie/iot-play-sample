'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var cfenv = require('cfenv');
var bmServices = require('./server/services/services');
var app = express();
app.use(express.static(__dirname + '/public', {
	index: 'play.html'
}));
app.use(bodyParser.json()); // for parsing application/json
var appEnv = cfenv.getAppEnv();

var urlRoute = require('./server/routes/snip');
var iotRoute = require('./server/routes/iotTryService');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// lon02-2 config
// var Config = {
// 	org: "play",
// 	apiKey: "a-play-f5cym38oit",
// 	apiToken: "Co0D)Z!50xF89PiaRH"
// };

// var options = {
// 	host: Config.org + ".staging.internetofthings.ibmcloud.com",
// 	port: 443,
// 	headers: {
// 		"content-type" : "application/json"
// 	},
// 	auth: Config.apiKey+':'+Config.apiToken
// };

//Get IoT Foundation credentials
var credentials = bmServices.getIoTService('discover-iot-try-service');

var basicConfig = {
	org: credentials.org,
	apiKey: credentials.apiKey,
	apiToken: credentials.apiToken
};

var options = {
	host: 'internetofthings.ibmcloud.com',
	port: 443,
	headers: {
	  'Content-Type': 'application/json'
	},
	auth: basicConfig.apiKey + ':' + basicConfig.apiToken
};

app.get('/iotphone/device/:deviceid', function(req, res) {
	var deviceid = req.params.deviceid;
	res.writeHead(302, {
		'Location': '/iotphone/index.html?deviceid=' + deviceid
	});
	res.end();
});

app.get('/deviceCount', function(req,res) {
	// options.method = 'GET';
	// options.path = 'api/v0002/bulk/devices';
	// console.log(options);
	//
	// var iot_req = https.request(options, function(iot_res) {
	// 	var str = '';
	// 	iot_res.on('data', function(chunk) {
	// 		str += chunk;
	// 	});
	// 	iot_res.on('end', function() {
	// 		try {
	// 			var deviceInfo = JSON.parse(str);
	// 			console.log(deviceInfo);
	// 			res.send({ deviceCount: deviceInfo.meta.total_rows });
	// 		} catch (e) { console.log("ERROR ON END", e); }
	// 	});
	// }).on('error', function(e) { console.log("ERROR", e); });
	// iot_req.end();
	res.send({ deviceCount: 1 });
});

app.post('/createDevice', function(req, res) {
	console.log("/createDevice");

	var deviceId = "test";
	var typeId = "test";
	var password = "test";

	if (req.body.deviceId) { deviceId = req.body.deviceId; }
	if (req.body.typeId) { typeId = req.body.typeId; }
	if (req.body.password) { password = req.body.password; }

	var deviceDetails = {
		type: typeId,
		id: deviceId
	};

	//console setting method and path
	console.log('cred.org = ', basicConfig.org);
	options.method = 'POST';
	options.path = 'api/v0001/organizations/' + basicConfig.org + '/devices';

	var iot_req = https.request(options, function(iot_res) {
		var str = '';
		iot_res.on('data', function(chunk) {
			str += chunk;
		});
		iot_res.on('end', function() {
			console.log("/createDevice end: ", str);
			try {
				//var deviceInfo = JSON.parse(str);
				//console.log("created device: ", deviceInfo);
				console.log("created device!");
				res.send({ result: "Success!" });
			} catch (e) { console.log("ERROR ON END", e); }
		});
	}).on('error', function(e) { console.log("ERROR", e); });
	iot_req.write(JSON.stringify(deviceDetails));
	iot_req.end();
});

app.use('/url', urlRoute);
app.use('/iot', iotRoute);

console.log("Environment variable HTTPS: " + process.env.HTTPS);
if (process.env.HTTPS === "true") {
	//Used for testing enviroments outside bluemix only
	var fs = require('fs');
	var options = {
		key: fs.readFileSync('./server/config/Xmam.ibmserviceengage.com.privatekey'),
		cert: fs.readFileSync('./server/config/mam_ibmserviceengage_com.pem'),
		ciphers: 'ECDHE-RSA-AES256-SHA:AES256-SHA:RC4-SHA:HIGH:!RC4:!MD5:!aNULL:!EDH:!AESGCM',
		honorCipherOrder: true
	};
	var httpServer = require('https').createServer(options, app);
	var port = 9991;
	if (process.env.PORT) {
		port = process.env.PORT;
	}
	app.set('port', port);
	httpServer.listen(app.get('port'), function() {
		console.log('Node server listening https on port:' + app.get('port'));
	});
} else {
	app.listen(appEnv.port, function() {
		console.log("server starting on " + appEnv.url);
	});
}
