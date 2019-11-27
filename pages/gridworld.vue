<template>
  <v-container fluid>
    <div class="sub" v-html="buff">
    </div>
    <v-col>
        <v-row
          v-for="row in 6"
          align="center"
          justify="center"
        >
          <v-card
            v-for="col in 6"
            tile
            style="border: 0; box-shadow: 0 0 0 0.5px rgba(9,90,34,0.66);"
            width="5em"
            height="5em"
            :img="getImg(row, col)"
          >

            <v-img
              v-if="row === start[0] && col === start[1]"
              style="margin-left: 30%; margin-top: 30%"
              height="45px"
              width="30px"
              :src="require('~/assets/gridworld/char_right.png')"
            ></v-img>

            <v-img
              :hidden="footstepsActive(row, col)"
              style="margin-left: 30%; margin-top: 65%"
              height="16px"
              width="30px"
              :src="require('~/assets/gridworld/footsteps.png')"
            ></v-img>
          </v-card>
        </v-row>
      </v-col>
      <v-btn @click="getStoreData">get data</v-btn>
  </v-container>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'
    import data from '../plugins/vue-mqtt'
  export default {
      data() {
        return {
            holes: [
                [1, 2],
                [2, 4]
            ],
            obstacles: [
                [2, 2],
                [3, 2],
                [3, 5],
                [3, 6],
                [4, 2],
                [4, 3],
                [4, 5],
                [5, 3],
                [5, 6]
            ],
            footsteps: [
                [1, 3],
                [1, 4],
                [1, 5]
            ],
            start: [6, 1],
            end: [1, 6],
            finish: false,

            buff: 'Sub1:<br>'

        }
      },
      beforeMount() {
          this.$mqtt.subscribe('2tp/workshop/qtable')
      },
      methods: {
          getImg(row, col) {
              for (let i = 0; i < this.holes.length; i++) {
                  if (row === this.holes[i][0] && col === this.holes[i][1]) {
                      return require("~/assets/gridworld/hole2.png")
                  }
              }

              for (let i = 0; i < this.obstacles.length; i++) {
                  if (row === this.obstacles[i][0] && col === this.obstacles[i][1]) {
                      return  require("~/assets/gridworld/obstacle2.png")
                  }
              }

              if (row === this.end[0] && col === this.end[1]) {
                  if (this.finish) {
                      return require("~/assets/gridworld/chest_open.png")
                  }
                  else return require("~/assets/gridworld/chest_closed.png")
              }

              if (row === this.start[0] && col === this.start[1]) {
                  return require("~/assets/gridworld/start2.png")
              }

              return require("~/assets/gridworld/path.png")
          },
          footstepsActive(row, col) {
              let hidden = true;
              for (let i = 0; i < this.footsteps.length; i++) {
                  if (row === this.footsteps[i][0] && col === this.footsteps[i][1]) {
                      hidden = false;
                  }
              }
              return hidden
          },
          getStoreData() {
              this.$store.commit('test', 'testdata')
              console.log(this.$store.state.message)
          },
          ...mapGetters(['getMessage']),
      },
      computed: mapState({ message: state => state.message}),
      watch: {
          message() {
              console.log("change")
          }
      },
      mqtt: {
          /** 'VueMqtt/publish1' or '+/publish1' */
          '2tp/test' (data) {
              this.buff = data
          }
      }
  }
</script>


