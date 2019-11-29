<template>
  <v-container fluid>
      <v-row justify="center" style="height: 3em;">
          <h1>{{message}}</h1>
      </v-row>
      <v-row>
          <v-col>
              <v-row
                v-if="rows > 0"
                v-for="row in rows"
                align="center"
                justify="center"
              >
                  <v-card
                    v-if="cols > 0"
                    v-for="col in cols"
                    tile
                    style="border: 0; box-shadow: 0 0 0 0.5px rgba(9,90,34,0.66);"
                    width="5em"
                    height="5em"
                    :img="getImg(row, col)"
                  >

                      <v-img
                        v-if="footstepsActive(row, col)"
                        style="margin-left: 30%; margin-top: 65%;position: absolute"
                        height="16px"
                        width="30px"
                        position="absolute"
                        :src="require('~/assets/gridworld/footsteps.png')"
                      ></v-img>

                      <v-img
                        v-if="col === end[0] && row === end[1]"
                        :src="getChestImg()"
                        style="margin-left: 20%; position: absolute; margin-top: 10%;"
                        width="48px"
                      ></v-img>

                      <v-img
                        v-if="col === currentPosition[0] && row === currentPosition[1]"
                        style="margin-left: 30%; margin-top: 30%; position: absolute"
                        height="45px"
                        width="30px"
                        :src="require('~/assets/gridworld/char_down.png')"
                      ></v-img>

                      <v-img
                        v-if="isHoleActive(row, col)"
                        :hidden="!hole"
                        :src="require('~/assets/gridworld/gone.png')"
                        width="32px"
                        height="32px"
                        style="margin-left: 30%; margin-top: 35%"
                      ></v-img>
                  </v-card>
              </v-row>
          </v-col>
          <v-col>
              <v-row
                v-if="rows > 0"
                v-for="row in rows"
                align="center"
                justify="center"
              >
                  <v-card
                    v-if="cols > 0"
                    v-for="col in cols"
                    tile
                    style="border: 0; box-shadow: 0 0 0 0.5px #2f2f2f;"
                    width="5em"
                    height="5em"
                    :color="getColor(row, col)"
                  >
                      <v-img
                          width="30px"
                          v-for="action of findActions(row, col)"
                          :src="require('~/assets/gridworld/arrow.png')"
                          :class="'arr'+ action"
                      ></v-img>
                  </v-card>
              </v-row>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
  export default {
      data() {
          return {
              cols: 0,
              rows: 0,
              message: '',

              // Grid 1
              holes: [],
              obstacles: [],
              footsteps: [],
              start: [],
              end: [],
              currentPosition: [],

              // Grid 2
              bestPath: [],
              bestActions: [],
              hole: false,
          }
      },
      beforeMount() {
          console.log(this.$mqtt)
          if (this.$mqtt.connected) {
              this.$mqtt.subscribe('2tp/workshop/gridworld/state')
          }
          else this.message = 'Websocket not connected'
      },
      methods: {
          // Grid 1
          getImg(row, col) {
              for (let i = 0; i < this.holes.length; i++) {
                  if (col === this.holes[i][0] && row === this.holes[i][1]) {
                      return require("~/assets/gridworld/hole2.png")
                  }
              }
              for (let i = 0; i < this.obstacles.length; i++) {
                  if (col === this.obstacles[i][0] && row === this.obstacles[i][1]) {
                      return require("~/assets/gridworld/obstacle2.png")
                  }
              }
              if (col === this.start[0] && row === this.start[1]) {
                  return require("~/assets/gridworld/start.png")
              }
              return require("~/assets/gridworld/path.png")
          },
          footstepsActive(row, col) {
              let active = false;
              for (let i = 0; i < this.footsteps.length; i++) {
                  if (col === this.footsteps[i][0] && row === this.footsteps[i][1]) {
                      active = true;
                  }
              }
              return active
          },
          getCharImg(row, col) {
              let lastposition = this.footsteps[this.footsteps.length -2]
              console.log(lastposition)
              if (lastposition !== undefined) {
                  if (row > lastposition[1]) {
                      return require("~/assets/gridworld/char_down.png")
                  }
                  if (row < lastposition[0]) {
                      return  require("~/assets/gridworld/char_up.png")
                  }
                  if (col > lastposition[0]) {
                      return require("~/assets/gridworld/char_right.png")
                  }
                  if (col < lastposition[1]) {
                      return  require("~/assets/gridworld/char_left.png")
                  }
              }
              else return require("~/assets/gridworld/char_down.png")
          },
          getChestImg() {
              if (this.end !== undefined) {
                  if (this.end[0] === this.currentPosition[0] && this.end[1] === this.currentPosition[1]) {
                      return require("~/assets/gridworld/chest_open1.png")
                  } else return require("~/assets/gridworld/chest_closed1.png")
              }
          },
          isHoleActive(row, col) {
              for (let i = 0; i < this.holes.length; i++) {
                  if (col === this.holes[i][0] && row === this.holes[i][1] &&
                      col === this.currentPosition[0] && row === this.currentPosition[1]) {
                      this.hole = true;
                      console.log("hole active")
                  }
              }
          },

          // Grid 2
          getColor(row, col) {
              for (let i = 0; i < this.bestPath.length; i++) {
                  if (col === this.bestPath[i][0] && row === this.bestPath[i][1]) {
                      return 'white'
                  }
              }
          },
          findActions(row, col) {
              for (let i = 0; i < this.bestActions.length; i++) {
                  if (this.bestActions[i].y === row && this.bestActions[i].x === col) {
                      return this.bestActions[i].actions
                  }
              }
          },
          isChar(row, col) {
              if (col === this.currentPosition[0] && row === this.currentPosition[1]) {
                  for (let i = 0; i < this.holes.length; i++) {
                      if (col === this.holes[i][0] && row === this.holes[i][1]) {
                          this.hole = true;
                          return false
                      }
                  }
                  return true
              }
              else return false
          }
      },
      mqtt: {
          '2tp/workshop/gridworld/state' (data) {
              this.hole = false
              let json = JSON.parse(data)
              console.log(json)

              this.cols = parseInt(json.board_setup.nb_cols)
              this.rows = parseInt(json.board_setup.nb_rows)

              this.holes = json.board_setup.holes
              this.obstacles = json.board_setup.obstacles
              this.start = json.board_setup.start
              this.end = json.board_setup.end[0]
              this.currentPosition = json.board_setup.footsteps[json.board_setup.footsteps.length -1]
              this.footsteps = json.board_setup.footsteps

              this.bestActions = json.best_actions
              this.bestPath = json.best_path_now
          }
      }
  }
</script>

<style>
  .arrUp {
    transform: rotateZ(-90deg);
    left: 30%;
    position: absolute;
  }
  .arrLeft {
    transform: rotateZ(180deg);
    position: absolute;
    top: 30%
  }
  .arrRight {
    position: absolute;
    top: 30%;
    left: 60%;
  }
  .arrDown {
    position: absolute;
    transform: rotateZ(90deg);
    top: 60%;
    left: 30%;
  }
</style>


