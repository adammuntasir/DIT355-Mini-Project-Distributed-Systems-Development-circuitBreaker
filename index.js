// request generator data bytes 
// convert the bytes to string 
// data 2 pieces of information date less than 40 bytes / booking request more than 40 bytes 
// both have the same date 

// Buffer is an array that takes the date maximum fixed size 
// if the size that we recieve from the request Generator does not fit the buffer 
// it invokes the circuit breaker and it turns on for 3 seconds 

// circuit is an array that will pass data for publishing if its turned off
// if the circuit breaker is on, we dont publish to the next component, // we see in the console that its turned on 


var subscriber = require('./src/subscriber.js');
var publisher = require('./src/publisher.js');
const logic = require('./src/logic.js');
const { Client } = require('mqtt');

subscriber.start(); //starts the subscriber.js module
publisher.start(); //starts the publisher.js module
var maximumThreshold = 5
var bufferClass = new logic(maximumThreshold) // number of data from request generator before threshold hits
var dataReceived
var outside = new Array()

subscriber.eventListener.on("mqttRecieved", function(topic, payload) {

    console.log(outside.length)
    outside.push(payload)
    try {

        var bytesString = String.fromCharCode(...payload) // https://programmingwithswift.com/how-to-convert-byte-array-to-string-with-javascript/ EQUAL TO STRING


        bufferClass.pushInside(bytesString) // the buffer array will insert inside it the payload after being converted to a string


    } catch (error) {
        console.log(error)
    }




    // every second from request generator is 1 message we should wait 10 seconds to fill up the buffer with 10 messages 
    // if we get in 10 seconds 11 messages that means the circuit breaker 
    var time = 1000
    if (bufferClass.elementsInside.length > 0) {
        time += 100000;
    }
    setInterval(function() { // we have the call back function so that we empty up the bufferClass as it gets filled up
            // without the callback function the buffer will be emptied every time we use the function displayFirstElement
            var bytesString = String.fromCharCode(...payload)

            dataReceived = bufferClass.displayFirstElement(bytesString)
            publisher.publish(dataReceived)

        }, time) // we are giving the buffer 11 second as a chance for it to start filling up, once we get a value we it adds up the time, if we reach the time the buffer will reset to zero (it will reach the time if no one subscribes for a long period of time) 


})