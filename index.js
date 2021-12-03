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
var dataReceived
var maximumSize = 5
var countPayload = new Array()
var bufferClass = new logic(maximumSize) // number of data from request generator before threshold hits

subscriber.eventListener.on("mqttRecieved", function(topic, payload) {

    try {
        var bytesString = String.fromCharCode(...payload)

        countPayload.push(bytesString)
        console.log(countPayload.length)

        if (countPayload.length < maximumSize) {
            console.log(countPayload.length)
            publisher.publish(bytesString)


        } else {
            logic.openCircuitBreaker()
            countPayload = []
        }
        //   }
    } catch (error) {
        //subscriber.stopAndReconnect()
    }



})