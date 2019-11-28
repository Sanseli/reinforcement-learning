import Vue from 'vue'
import VueMqtt from 'vue-mqtt';

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:9001')

Vue.use(VueMqtt, client);
