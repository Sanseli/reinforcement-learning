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
                    id="card"
                    :img="getImg(row, col)"
                    :width="cardSize"
                    :height="cardSize"
                  >
                      <v-img
                        v-show="footstepsActive(row, col)"
                        style="margin-left: 30%; margin-top: 68%;position: absolute"
                        position="absolute"
                        :width="stepWidth"
                        :height="stepHeight"
                        :src="require('~/assets/gridworld/footsteps.png')"
                      ></v-img>

                      <v-img
                        v-if="col === end[0] && row === end[1]"
                        :src="getChestImg()"
                        style="margin-left: 20%; position: absolute; margin-top: 10%;"
                        :width="chestWidth"
                        height="auto"
                      ></v-img>

                      <v-img
                        v-show="col === currentPosition[0] && row === currentPosition[1]"
                        :hidden="hole"
                        style="margin-left: 32%; margin-top: 28%; position: absolute"
                        :width="charWidth"
                        :height="charHeight"
                        :src="require('~/assets/gridworld/char_down.png')"
                      ></v-img>

                      <v-img
                        v-show="hole && currentPosition[0] === col && row === currentPosition[1]"
                        :src="require('~/assets/gridworld/gone.png')"
                        :width="charTrapSize"
                        :height="charTrapSize"
                        style="margin-left: 20%; margin-top: 24%"
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
                    :width="cardSize"
                    :height="cardSize"
                    :color="getColor(row, col)"
                  >
                      <v-img
                          v-for="action of findActions(row, col)"
                          :src="require('~/assets/gridworld/arrow.png')"
                          :class="'arr'+ action"
                          :height="arrSize"
                          :width="arrSize"
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

              windowWidth: 0,
              windowHeight: 0,

              // Images
              // img
          }
      },
      beforeMount() {
          if (this.$mqtt.connected) {
              this.$mqtt.subscribe('2tp/workshop/gridworld/state')
          }
          else this.message = 'Websocket not connected'

          this.$nextTick(function() {
              window.addEventListener('resize', this.getWindowWidth);
              window.addEventListener('resize', this.getWindowHeight);

              //Init
              this.getWindowWidth()
              this.getWindowHeight()
          })
      },
      computed: {
          cardSize() {
              return (this.windowWidth / 3) / this.cols
          },
          stepWidth() {
              return ((this.windowWidth / 3) / this.cols) / 2.5
          },
          stepHeight() {
              return ((this.windowWidth / 3) / this.cols) / 4.5
          },
          charWidth() {
              return ((this.windowWidth / 3) / this.cols) / 2.3
          },
          charHeight() {
              return ((this.windowWidth / 3) / this.cols) / 1.5
          },
          chestWidth() {
              return ((this.windowWidth / 3) / this.cols) / 1.5
          },
          charTrapSize() {
              return ((this.windowWidth / 3) / this.cols) / 1.8
          },
          arrSize() {
              return ((this.windowWidth / 3) / this.cols) / 2.5
          }
      },
      methods: {
          // Grid 1
          getImg(row, col) {
              const obstacle = this.obstacles.find(o => o[0] === col && o[1] === row)
              if (obstacle !== undefined) {
                  // for (let i = 0; i < this.obstacles.length; i++) {
                  //     if (col === this.obstacles[i][0] && row === this.obstacles[i][1]) {
                  return require("~/assets/gridworld/obstacle3.png")
                  // }
              }

              const hole = this.holes.find(h => h[0] === col && h[1] === row)
              // for (let i = 0; i < this.holes.length; i++) {
              //     if (col === this.holes[i][0] && row === this.holes[i][1]) {
              if (hole !== undefined) {
                      return require("~/assets/gridworld/hole2.png")
                  // }
              }

              if (col === this.start[0] && row === this.start[1]) {
                  return require("~/assets/gridworld/start.png")
              }

              return require("~/assets/gridworld/path.png")
          },
          footstepsActive(row, col) {
              const footstep = this.footsteps.find(f => f[0] === col && f[1] === row)
              let active = false;
              if (footstep !== undefined) {
                  const hole = this.holes.find(h => h[0] === col && h[1] === row)
                  if (hole !== undefined) {
                      this.hole = true
                  }
                  else active = true;
              }
              return active
          },
          getChestImg() {
              if (this.end !== undefined) {
                  if (this.end[0] === this.currentPosition[0] && this.end[1] === this.currentPosition[1]) {
                      return require("~/assets/gridworld/chest_open1.png")
                  } else return require("~/assets/gridworld/chest_closed1.png")
              }
          },


          // Grid 2
          getColor(row, col) {
              // console.log(this.bestPath)
              const path = this.bestPath.find(p => p[0] === col && p[1] === row)
              //
              // console.log(path)
              if (path !== undefined) {
              // for (let i = 0; i < this.bestPath.length; i++) {
              //     if (col === this.bestPath[i][0] && row === this.bestPath[i][1]) {
                      return 'white'
                  // }
              }
          },
          findActions(row, col) {
              const action = this.bestActions.find(a => a.y === row && a.x === col)

              if (action !== undefined) {
              // for (let i = 0; i < this.bestActions.length; i++) {
              //     if (this.bestActions[i].y === row && this.bestActions[i].x === col) {
                      return action.actions
                  // }
              }
          },
          getWindowWidth(event) {
              this.windowWidth = document.documentElement.clientWidth;
          },

          getWindowHeight(event) {
              this.windowHeight = document.documentElement.clientHeight;
          }
      },
      beforeDestroy() {
          window.removeEventListener('resize', this.getWindowWidth);
          window.removeEventListener('resize', this.getWindowHeight);
      },
      mqtt: {
          '2tp/workshop/gridworld/state' (data) {
              if (this.hole) {this.hole = false}
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


