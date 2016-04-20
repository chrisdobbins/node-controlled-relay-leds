# node-controlled-relay-leds

##Description##
This is an application that exposes an API allowing the end user to control a strip of RGB LEDs connected to a relay. In its current form, it can be used to control any device connected to the relay module. It has an 'automatic' mode that links the state of the LEDs to the state of a PIR sensor, as well as a 'manual' mode. pirLed.js is automatic control only, while switchModes.js, as the name suggests, allows the end user to switch between automatic and manual control of the relay.

##Components##

###Hardware###
* Raspberry Pi 2
* Sainsmart 16-channel 12V relay board
* SMD5050 RGB LED strip
* one (1) 2N2222 transistor
* one (1) 1 kOhm resistor
* one (1) PIR sensor

###Software###
* Node.js modules
  * onoff
  * Express.js
  * body-parser

##To-Do List (in order of priority)##
* Rewrite and refactor using ES6
* Unit tests
* Add functionality to control the colors on the LED strip.=
* Add a computer-generated schematic
* Add functionality to monitor door/window sensors and send SMS alerts
* Add functionality to monitor a solar panel and battery charge
