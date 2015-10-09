(function() {
  'use strict';

  exports.getIoTService =  function(serviceName){

    var empty = {
    	"iotf-service": [{
    		"name": "",
    		"label": "",
    		"plan": "",
    		"credentials": {
    			"iotCredentialsIdentifier": "",
    			"mqtt_host": "",
    			"mqtt_u_port": 1883,
    			"mqtt_s_port": 8883,
    			"base_uri": "",
    			"http_host": "",
    			"org": "",
    			"apiKey": "",
    			"apiToken": ""
    		}
    	}]
    };

    var config = empty;

    if (process.env.VCAP_SERVICES) {
  		config = JSON.parse(process.env.VCAP_SERVICES);
  	}

    var iotService = config['iotf-service'];
		for (var index in iotService) {
			if (iotService[index].name === serviceName) {
				//console.log(iotService[index].credentials);
				return iotService[index].credentials;
			}
		}

    //Error
    return {error: true, message: "No Credentials Found!"};

  };

}());
