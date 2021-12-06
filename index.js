// request generator data bytes 
// convert the bytes to string 
// data 2 pieces of information date less than 40 bytes / booking request more than 40 bytes 
// both have the same date 

// Buffer is an array that takes the date maximum fixed size 
// if the size that we recieve from the request Generator does not fit the buffer 
// it invokes the circuit breaker and it turns on for 3 seconds 

// circuit is an array that will pass data for publishing if its turned off
// if the circuit breaker is on, we dont publish to the next component, // we see in the console that its turned on 

const { performance } = require('perf_hooks');

var subscriber = require('./src/subscriber.js');
var publisher = require('./src/publisher.js');
const logic = require('./src/logic.js');

subscriber.start(); //starts the subscriber.js module
publisher.start(); //starts the publisher.js module
var maximumThreshold = 20
var bufferClass = new logic(maximumThreshold) // number of data from request generator before threshold hits
var outside = new Array()

subscriber.eventListener.on("mqttRecieved", function(topic, payload) {
    var bytesString = String.fromCharCode(...payload)

    // we can say if the time to fill the array is less than 0.01 then the circuit breaker opens 
    var startTime = performance.now() // start measuring the speed
    outside.push(bytesString)
    console.log(outside.length)
    if (outside.length == maximumThreshold) {
        var endTime = performance.now()
        outside = [] // reset the array when full 
        if ((endTime - startTime) < 0.4) { // find the speed, because if we reach the threshold 
            console.log((endTime - startTime))
            console.log("Circuit Breaker Open")
            bufferClass.openCircuitBreaker()
        } else {
            console.log((endTime - startTime))
            console.log("Circuit Breaker does not need to open")
        }
    } else {
        bufferClass.pushInside(bytesString)
        var dataReceived = bufferClass.displayFirstElement(bytesString) // we get the first element and remove
        publisher.publish(dataReceived) // we publish the first element 
    }



})