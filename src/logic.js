const publisher = require('./publisher.js');
const access = require('../../global_values')


class BufferArrayLogic {

    constructor(maximumAmount) {
        this.maximumLength = maximumAmount
        this.elementsInside = []
    }


    pushInside(elements) {
        if (this.elementsInside.length < this.maximumLength) {
            this.elementsInside.push(elements)
        }
    }

    displayFirstElement() {
        return this.elementsInside.shift();
    }

    openCircuitBreaker() {
        console.log("The circuit breaker is now open")
        var ToSend = JSON.stringify({ c: "c" })
        publisher.publish(ToSend)
    }
}

module.exports = BufferArrayLogic