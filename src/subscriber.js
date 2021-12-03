//Setup of subscriber
//Setup of subscriber
var mqtt = require("mqtt");
var options = { qos: 1, keepalive: 100, reconnectPeriod: 1000000 };
var access = require("../../global_values");
ip = access.ip_address;
tcp_port = access.tcp_port;
var client = mqtt.connect("tcp://" + ip + ":" + tcp_port, options);

const EventEmitter = require("events"); //This is a build in class in Node.js required to listen to events such as an incoming MQTT message
const emitter = new EventEmitter(); //Creating an new emitter that forwards incoming MQTT messages as events

var subscriber = {
    eventListener: emitter, //This will export our emitter and include it in the module that index.js requires

    stopAndReconnect: function() {

        client.reconnect()
        console.log("We unsubscribed")

        sleepFor(1000)

        /*
        client.subscribe()
        console.log("We subscribed again")
*/

        function sleepFor(sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* Do nothing */ }
        }
    },
    start: function() {
        //Called when client is connected
        client.on("connect", function() {
            console.log("Status: Subscriber is connected to broker");
            startSubscription();
        });

        //Called when client is disconnected
        client.on("disconnect", function() {
            console.log("Status: Subscriber has been disconnected");
        });

        //Called when client is reconnecting
        client.on("reconnect", function() {
            console.log("Status: Subscriber is reconnecting");
        });

        //Called when client is offline
        client.on("offline", function() {
            console.log("Status: Subscriber is offline");
            client.reconnect();
        });

        //Called when client receives a message
        client.on("message", function(topic, message) {
            //Here, when our MQTT client recieves a message from the broker, we let our emitter
            // //forward the topic and message internally to the index.js as an event mqttRecieved
            emitter.emit("mqttRecieved", topic, message);
        });

        client.on("unsubscribe", function() {
            console.log("Status: Subscriber is offline");
            client.reconnect();
        });
    },
};

function startSubscription() {
    client.subscribe(access.FromClient); // receive the chosen date
}

module.exports = subscriber;