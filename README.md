# node-controlled-relay-leds

##Description##
This is an application that exposes an API allowing the end user to control a strip of RGB LEDs connected to a relay. In its current form, it can be used to control any device connected to the relay module. It has an 'automatic' mode that links the state of the LEDs to the state of a PIR sensor, as well as a 'manual' mode. pirLed.js is automatic control only, while switchModes.js, as the name suggests, allows the end user to switch between automatic and manual control of the relay.
Edit: (4/3/16)
I've added a bit more functionality to it in the form of SMS notifications if activity is detected during the day, when no one should be around. I'm also planning to add another relay, microcontroller (most likely the MSP432), and additional lighting and a fan for climate control.

##Components##

###Hardware###
* Raspberry Pi 2
* Sainsmart 16-channel 12V relay board
* SMD5050 RGB LED strip
* one (1) 2N2222 transistor
* one (1) 1 kOhm resistor
* one (1) PIR sensor

##To-Do##
* Functionality to control the colors on the LED strip will be added at a future date. Because the RPi 2 only has two hardware PWM channels, this will likely involve moving everything over to the Espruino Pico, which has 21 PWM pins.
* Adding a computer-generated schematic. The primary hurdle to that has been the difficulty of finding an RGB LED schematic symbol.
* Adding functionality to monitor door/window sensors
* ~~Add functionality to send SMS alerts.~~
* Add functionality to monitor a solar panel and battery charge.-
* Refactor the automaticLights function, as it's gotten way too big and goes beyond its original scope
* Move things into different modules, as appropriate.
