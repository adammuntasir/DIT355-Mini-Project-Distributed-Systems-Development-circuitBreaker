const publisher = require('./publisher.js');
const access = require('../../global_values')


class BufferArrayLogic {

    constructor(maximumAmount) {
        this.maximumLength = maximumAmount
        this.elementsInside = []
    }


    pushInside(elements) {
        console.log(this.elementsInside.length)
        console.log(elements)
        if (this.elementsInside.length < this.maximumLength) {
            this.elementsInside.push(elements)

        }
        if (this.elementsInside.length >= this.maximumLength) {
            this.openCircuitBreaker() // add logic to make the subscription wait 5 seconds before subscribing again
                // make the array empty again before pushing again 

            this.elementsInside = [] // resets the array length
        }
    }


    displayFirstElement() {

        return this.elementsInside.shift();
    }

    openCircuitBreaker() {

        console.log("The circuit breaker is now open") // send message to visualizer, and the website will deactivate the button of subscribe for 5 seconds, or the request generator should keep going but we stop receiving from it 
            // we have to stop recieving from 
        var ToSend = JSON.stringify({ c: "c" })
        publisher.publish(ToSend)

    }
}

module.exports = BufferArrayLogic