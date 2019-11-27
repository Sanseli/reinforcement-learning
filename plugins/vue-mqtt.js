import Vue from 'vue'
import VueMqtt from 'vue-mqtt';

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.150.138.3:9001')

Vue.use(VueMqtt, client);

// client.on("connect",  () => {
//   client.subscribe("2tp/workshop/qtable");
//   console.log("Connected to MQTT Broker.");
// });
//
// export let data = '';
// client.on('message', function (topic, payload, message) {
//   // message is Buffer
//   data = payload.toString()
//   // store.commit('increment', payload.toString())
// });

