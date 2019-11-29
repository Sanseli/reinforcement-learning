import Vue from 'vue'
import VueMqtt from 'vue-mqtt';
import file from '!raw-loader!~/assets/tunnel-domain.txt'

console.log(file)
var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://10.150.138.90:9001')
var client  = mqtt.connect(`mqtt://${file}:80`)

Vue.use(VueMqtt, client);


