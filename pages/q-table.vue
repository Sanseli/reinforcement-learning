<template>
  <div>
    <v-data-table :headers="headers" :items="buff"></v-data-table>
  </div>

</template>

<script>
  export default {
      data() {
          return {
              buff: [],

              headers: [
                  {value: 'state', text: 'State',},
                  {value: 'up', text: 'Up', width: '20%'},
                  {value: 'down', text: 'Down', width: '20%'},
                  {value: 'left', text: 'Left', width: '20%'},
                  {value: 'right', text: 'Right', width: '20%'}
              ]
          }
      },
      methods: {
          log() {
              console.log(this.buff)
          }
      },
      beforeMount() {
        this.$mqtt.subscribe('2tp/workshop/qtable')
      },
      mqtt: {
          /** 'VueMqtt/publish1' or '+/publish1' */
          '2tp/workshop/qtable' (data) {
              this.buff = JSON.parse(data)
          }
      }
  }
</script>
