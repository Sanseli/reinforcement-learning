import Vue from 'vue'
import VueMqtt from 'vue-mqtt';

Vue.use(VueMqtt, 'ws://iot.eclipse.org/ws', options);

export default new VueMqtt({
  mqtt: {
    'param/+/+/test': function(val) {
      console.log('param/+/+/test')
    },
    'param/#': function(val) {
      console.log('param/#')
    },
    'param/param/param/test': function(val) {
      console.log('param/param/param/test')
    },
    'template/+' (data, topic) {
      if (topic.split('/').pop() === '12345') {
        console.log('topic:', 'template/12345')
      }
    },
    'template/+/param/param' (data, topic) {
      if (topic.split('/')[1] === '12345') {
        console.log('topic:', 'template/12345/param/param')
      }
    }
  },
  methods: {
    clickSub: function(val) {
      this.$mqtt.subscribe('param/param/param/test')
    },
    clickPub: function(val) {
      this.$mqtt.publish('param/param/param/test', 'message')
    }
  }
})
