var GPIO = require('onoff').Gpio;
var app = require('express')();
var bodyParser = require('body-parser');
var homeSensor = require('./hometemp');
var dotenv = require('dotenv').load();
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var ledStripPin = 27;
var ledStrip = new GPIO(ledStripPin, 'out');

//var crontab = require('node-crontab');
// var red = new GPIO(redPin, 'out');
// var green = new GPIO(greenPin, 'out');
// var blue = new GPIO(bluePin, 'out');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/temp', function(req, res) {
    res.json({temp: homeSensor.temp[0], humidity: homeSensor.humidity[0] });
});

app.post('/manualLights', function(req, res) {
    console.log('ledStrip: ', ledStrip);
    console.log(req.body);
    var newState = req.body.newState;
    controlRelay(ledStrip, newState);
    res.status(200).send('lights are '+ newState + '\n');
});

app.post('/automaticLights', function(req, res) {
    var newState = req.body.newState;
    automaticControl(ledStrip, newState, res);    
});

app.listen(3000);
process.on('SIGINT', exit);

function automaticControl(device, newState, response) {
    var pirPin = 18;
        try {
            var pir = new GPIO(pirPin, 'in', 'both');
        }
        catch(err) {
            response.status(500).send('cannot start automatic mode. error: ' + err + '\n');
        }
    if (newState === 'on') {    
        response.status(200).send('automatic mode activation started' + '\n');
        calibrate();
        console.log('Calibration is complete!');
        var deviceInitialState = pir.readSync() ? 'on' : 'off';
        controlRelay(device, deviceInitialState);
        pir.watch(function(err, pirValue) {
            if (err) {
                throw new Error(err.stack);
            }
            console.log(pirValue);
            var now = new Date(Date.now());
            // subtracting 4 accounts for the time zone difference
            if (pirValue === 1 && ((now.getHours() - 4 < 18) && (now.getHours() - 4 > 7))) {
                console.log(now.getHours());
                client.sendMessage({
                    to: process.env.TO_PHONE,
                    from: process.env.FROM_PHONE,
                    body: 'Intruder alert! Activity detected on ' + now,
                }, function(err, response) {
                    if (err) {
                        console.log(err.stack);
                    }
                    console.log(response.from);
                    console.log(response.body);
                });
            }            
            var timestamp = new Date(Date.now());
            console.log('pirValue = ' + pirValue + '\n' + 'Time: ' + timestamp.toISOString() + '\n');
            var deviceCurrentState = pirValue ? 'on' : 'off';
            controlRelay(device, deviceCurrentState);
        });
    }
    else {
        try {
            pir.unexport();
        }
        finally {
            controlRelay(device, newState);  
            response.status(200).send('automatic mode off' + '\n');
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

function controlRelay(device, newState) {
    console.log(device);
    if (newState === 'on') {
        device.writeSync(1);
    } else if (newState === 'off') {
        device.writeSync(0);
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
