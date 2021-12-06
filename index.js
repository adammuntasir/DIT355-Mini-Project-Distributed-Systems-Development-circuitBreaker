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

subscriber.eventListener.on("mqttRecieved", function(payload) {

    try {
        var bytesString = String.fromCharCode(...payload)
        bufferClass.pushInside(bytesString) // it will push until 20 messages are recieved 
        var dataReceived = bufferClass.displayFirstElement(bytesString) // we get the first element and remove
        publisher.publish(dataReceived) // we publish the first element 
    } catch (error) {
        console.log(error)
    }


    /*
        var startTime = performance.now()
        if (outside.length < 20) {
            outside.push(payload)
        }
        var endTime = performance.now()

        console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    // evry 5 seconds the performance is 0.014 milliseconds 
    // every .5 seconds the performance is 0.002 millisoconds 
    */


    // we can say if the time to fill the array is less than 0.01 then the circuit breaker opens 

    var startTime = performance.now()
    if (outside.length < 20) {
        outside.push(payload)
    }
    var endTime = performance.now()

    if ((endTime - startTime) < 0.01) {
        bufferClass.openCircuitBreaker()
    }

    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

})