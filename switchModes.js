var GPIO = require('onoff').Gpio;
var app = require('express')();
var bodyParser = require('body-parser');
var ledStripPin = 27;
var ledStrip = new GPIO(ledStripPin, 'out');

//var crontab = require('node-crontab');
// var red = new GPIO(redPin, 'out');
// var green = new GPIO(greenPin, 'out');
// var blue = new GPIO(bluePin, 'out');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/controlLightsManually', function(req, res) {
    console.log('ledStrip: ', ledStrip);
    var newState = req.body.newState;
    console.log('req.body.newState: ', req.body.newState);
    controlRelay(ledStrip, req.body.newState);
    res.status(200).send('lights are '+ newState + '\n');
});

app.post('/controlLightsAutomatically', function(req, res) {
    var newState = req.body.newState;
    console.log('req.body.newState: ', req.body.newState);
    automaticControl(ledStrip, newState, res);
});

app.listen(3000);
process.on('SIGINT', exit);

function automaticControl(relay, newState, response) {
    var pirPin = 18;
	try {
            var pir = new GPIO(pirPin, 'in', 'both');
	}
	catch(err) {
	 response.status(500).send('cannot start automatic mode. error: ' + err + '\n');
	}
    if (newState === 'on') {
       	response.status(200).send('automatic mode on');
        calibrate();
        console.log('Calibration is complete!');
        relay.writeSync(pir.readSync());
        pir.watch(function(err, pirValue) {
            if (err) {
                throw err;
            }           
            var timestamp = new Date(Date.now());
            console.log('pirValue = ' + pirValue + '\n' + 'Time: ' + timestamp.toISOString() + '\n');
            relay.writeSync(pirValue);
        });
    }
    else {
        try {
            pir.unexport();
	}
	finally {
	    relay.writeSync(0); 
	    response.status(200).send('automatic mode off');
	}
    }
    
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
}

function controlRelay(pin, newState) {
    console.log(pin);
    if (newState === 'on') {
        pin.writeSync(1);
    } else if (newState === 'off') {
        pin.writeSync(0);
    }
    else {
        throw err;
    }
}

function exit() {
    try {
        pir.unexport();
    }
    finally {
        ledStrip.unexport();  
        process.exit();
    }
}

function noop() {};    
