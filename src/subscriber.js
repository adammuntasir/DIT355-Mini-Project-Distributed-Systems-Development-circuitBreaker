//Setup of subscriber
//Setup of subscriber
var mqtt = require("mqtt");
var options = { qos: 1, keepalive: 100, reconnectPeriod: 1000000 };
var access = require("../../global_values");
ip = access.ip_address;
tcp_port = access.tcp_port;
var client = mqtt.connect("tcp://" + ip + ":" + tcp_port, options);

const EventEmitter = require("events"); //This is a build in class in Node.js required to listen to events such as an incoming MQTT message
const { FromClient } = require("../../global_values");
const emitter = new EventEmitter(); //Creating an new emitter that forwards incoming MQTT messages as events

var subscriber = {
    eventListener: emitter, //This will export our emitter and include it in the module that index.js requires
    stopAndReconnect2() {
        sleepFor(5000)

        //client.stopAndReconnect
        //client.subscribe(access.FromClient)


        console.log("the circtui breaker is closed again")

        function sleepFor(sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* Do nothing */ }
        }
    },
    stopAndReconnect: function() {


        client.subscribe(access.FromClient)


        console.log("We subscribed again")

        //Called when client receives a message
        client.on('message', function(topic, message) {
            emitter.emit('mqttRecieved', access.FromClient, message);
        })


    },
};


module.exports = subscriber;