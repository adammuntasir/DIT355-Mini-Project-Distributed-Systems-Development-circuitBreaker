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

subscriber.start(); //starts the subscriber.js module
publisher.start(); //starts the publisher.js module
var maximumThreshold = 20
var bufferClass = new logic(maximumThreshold) // number of data from request generator before threshold hits
var dataReceived
var outside = new Array()

subscriber.eventListener.on("mqttRecieved", function(topic, payload) {


    try {

        var bytesString = String.fromCharCode(...payload)
        bufferClass.pushInside(bytesString) // the buffer array will insert inside it the payload after being converted to a string

    } catch (error) {
        console.log(error)
    }


    var time = 10000 // having less than a second will give instant results (we can make the generator send in less than 1 second 4 messages)
    if (bufferClass.elementsInside.length > 0) {
        time += 1000;
    }
    setInterval(function() {
        var bytesString2 = String.fromCharCode(...payload)

        dataReceived = bufferClass.displayFirstElement(bytesString2)
        publisher.publish(dataReceived)

    }, time)


})