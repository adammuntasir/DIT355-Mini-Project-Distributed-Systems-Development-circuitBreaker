var subscriber = require('./subscriber.js');


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
        if (this.elementsInside.length == this.maximumLength) {
            this.openCircuitBreaker()

        }
    }

    displayFirstElement() {
        return this.elementsInside.shift();
    }


    openCircuitBreaker() {
        console.log("The circuit breaker is now open")
        subscriber.stopAndReconnect()
            // subscriber should stop receiving messages ( maybe invoke disconnected)
            // subscriber should start again after 3 seconds ( invoke reconnecting )
    }
}

module.exports = BufferArrayLogic