import Vue from 'vue'
import VueMqtt from 'vue-mqtt';
import store from "../store/index"

//1883

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.150.138.3:9001')


client.on("connect",  () => {
  client.subscribe("2tp/test");
  console.log("Connected to MQTT Broker.");
});

client.on('message', function (topic, payload, message) {
  // message is Buffer
  store().commit('setMqttMessage', payload.toString())
});

// Vue.use(VueMqtt, client, options);







// var mqtt = require('mqtt');
// var client  = mqtt.connect('ws://test.mosquito.org');
// console.log(client)

// Vue.use(VueMqtt, 'ws://iot.eclipse.org/ws', options);
// Vue.use(VueMqtt, 'ws://iot.eclipse.org/ws', options);

// client.on("connect",  () => {
  // client.subscribe("2tp/test");
  // console.log("Connected to MQTT Broker.");
// });
// client.on("connect", function() {
//   client.subscribe("2tp/test");
//   client.publish("2tp/test", "Hello mqtt");
// });
//
// client.on("message", function(topic, message) {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });


// export default new VueMqtt({
//   mqtt: {
//     'param/+/+/test': function(val) {
//       console.log('param/+/+/test')
//     },
//     'param/#': function(val) {
//       console.log('param/#')
//     },
//     'param/param/param/test': function(val) {
//       console.log('param/param/param/test')
//     },
//     'template/+' (data, topic) {
//       if (topic.split('/').pop() === '12345') {
//         console.log('topic:', 'template/12345')
//       }
//     },
//     'template/+/param/param' (data, topic) {
//       if (topic.split('/')[1] === '12345') {
//         console.log('topic:', 'template/12345/param/param')
//       }
//     }
//   },
//   methods: {
    // clickSub: function(val) {
    //   this.$mqtt.subscribe('2tp/test')
    // },
    // clickPub: function(val) {
    //   this.$mqtt.publish('2tp/test', 'message')
    // }
    // ...mapMutations(['addData'])
  // }
// })
