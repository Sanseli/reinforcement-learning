<template>
  <v-container fluid>
    <v-row justify="center" style="height: 3em;">
      <h1 v-if="message">{{message}}</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-row
          v-for="row in grid.rows"
          v-if="grid.rows > 0"
          align="center"
          justify="center"
        >
          <v-card
            v-for="col in grid.cols"
            v-if="grid.cols > 0"
            class="ma-1 text-center"
            raised
            tile
            :width="cardSize"
            :height="cardSize"
            :color="getColor(grid.state[row-1][col-1])"
          >
            <h1 v-if="grid.state[row-1][col-1] !== 0" :style="`font-size: ${Math.round(cardSize) /2}px; padding: 10%`">{{grid.state[row-1][col-1]}}</h1>
            <v-img :hidden="grid.state[row-1][col-1] !== 0" :src="require('~/assets/sliding-puzzle/2tp.png')"></v-img>
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
                grid: {
                    cols: 0,
                    rows: 0,
                    state: [],
                },

                buff: [],

                windowWidth: 0,
                windowHeight: 0,
            }
        },
        beforeMount() {
            const storedata = this.$store.state.slidingPuzzleData;
            if (storedata !== null) {
                this.grid = storedata;
            }

            if (this.$mqtt.connected) {
                this.$mqtt.subscribe('2tp/workshop/slidingpuzzle/state')
            } else this.message = 'Websocket not connected';

            this.$nextTick(function () {
                window.addEventListener('resize', this.getWindowWidth);
                window.addEventListener('resize', this.getWindowHeight);

                //Init
                this.getWindowWidth();
                this.getWindowHeight();
            })
        },
        computed: {
            cardSize() {
                if (this.windowWidth < this.windowHeight) {
                    return (this.windowWidth / this.grid.cols) / 1.5
                } else return (this.windowHeight / this.grid.cols) / 1.5
            },
            message() {
                if (!this.$mqtt.connected) {
                    return 'Websocket not connected'
                }
                else if (this.grid.rows === 0) {
                    return 'Nothing to display'
                }
            }
        },
        methods: {
            getColor(value) {
                if (value === 0) {
                    return 'white'
                }
            },
            getWindowWidth(event) {
                this.windowWidth = document.documentElement.clientWidth;
            },
            getWindowHeight(event) {
                this.windowHeight = document.documentElement.clientHeight;
            }
        },
        mqtt: {
            '2tp/workshop/slidingpuzzle/state'(data) {
                let json = JSON.parse(data)

                this.grid.rows = json.nb_rows
                this.grid.cols = json.nb_cols
                this.grid.state = json.state
            }
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.getWindowWidth);
            window.removeEventListener('resize', this.getWindowHeight);

            this.$store.commit('setSlidingPuzzleData', this.grid)
        }
    }
</script>
