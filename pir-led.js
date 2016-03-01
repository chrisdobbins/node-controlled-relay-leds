var crontab = require('node-crontab');
var GPIO = require('onoff').Gpio;
var pirPin = 18;
var relayPin = 27;
var pir = new GPIO(pirPin, 'in', 'both');
var relay = new GPIO(relayPin, 'out');
// var red = new GPIO(redPin, 'out');
// var green = new GPIO(greenPin, 'out');
// var blue = new GPIO(bluePin, 'out');

automaticControl();


function exit() {
    pir.unexport();
    relay.unexport();
    process.exit();
}
function noop() {};
function calibrate() {
    console.log('Please wait for the sensor to calibrate');
    var testDate = Date.now();
    // PIR should be calibrated for at least 30 seconds
    // by putting in an area with
    // no motion. I recommend covering it.
    // The loop below is for 45 seconds
    while ((Date.now() - testDate)/1000 < 45) {
        noop();
    }
}
function automaticControl() {
    calibrate();
    console.log('Calibration is complete!');

    pir.watch(function(err, value) {
        if (err) {
	    throw err;
        }
        var timestamp = new Date(Date.now());
        console.log('Value = ' + value + '\n' + 'Time: ' + timestamp.toISOString() + '\n');
        if (value === 1) {
            relay.writeSync(1); // turns on relay
            // green.writeSync(1);
            // blue.writeSync(1);
            // red.writeSync(1);
        }
        else {
	    relay.writeSync(0);
            // green.writeSync(1);
            // blue.writeSync(1);
            // red.writeSync(1);
        }
        
    });

    process.on('SIGINT', function(pins) {
        exit(pins);
    });
}
