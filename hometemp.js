var sensorLib = require('node-dht-sensor');

var readings = {
    temp: [],
    humidity: []
};

var dht11 =  {
    initialize: function() {
        // 11 corresponds to the type of DHT sensor (DHT11, in thie case)
        // the DHT11 is on pin 23
        return sensorLib.initialize(11, 23);
    },
    read: function() {
        var readOut = sensorLib.read();
        if (readings.temp.length > 0 || readings.humidity.length > 0) {
            readings.temp.length = 0;
            readings.humidity.length = 0;
        }
        
        readings.temp.push(toFahrenheit(readOut.temperature));
        // console.log(readings.temp);
        readings.humidity.push(readOut.humidity);
        // console.log(readings.humidity);
        function toFahrenheit(celsiusTemp) {
            return celsiusTemp * (9.0/5) + 32;
        }
        setTimeout(function () {
            dht11.read();
        }, 2000);
    }
};

if (dht11.initialize()) {
    dht11.read();
}
else {
    console.warn('Failed to initialize sensor');
}

module.exports = readings;
