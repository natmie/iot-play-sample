'use strict';

var app = require('angular').module('iotmarket');

app.controller('ConnectController', require('./connect/connectController'));
app.controller('DeviceController', require('./device/deviceController'));
app.controller('DeviceDataController', require('./deviceData/deviceDataController'));
app.controller('DeviceDataExtendController', require('./deviceDataExtend/deviceDataExtendController'));
app.controller('FooterController', require('./footer/footerController'));
