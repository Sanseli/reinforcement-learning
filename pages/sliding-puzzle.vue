<template>
  <v-container fluid>
    <v-row justify="center" style="height: 3em;">
      <h1>{{message}}</h1>
    </v-row>
    <v-row style="padding-top: 5em">
      <v-col>
        <v-row
          v-for="row in rows"
          v-if="rows > 0"
          align="center"
          justify="center"
        >
          <v-card
            v-for="col in cols"
            v-if="cols > 0"
            class="ma-1 text-center"
            raised
            tile
            width="10em"
            height="10em"
            :color="getColor(state[row-1][col-1])"
          >
            <h1 v-if="state[row-1][col-1] !== 0" style="font-size: 5em; padding: 10%">{{state[row-1][col-1]}}</h1>
            <v-img :hidden="state[row-1][col-1] !== 0" :src="require('~/assets/sliding-puzzle/2tp.png')"></v-img>
          </v-card>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    export default {
        data () {
            return {
                buff: [],

                cols: 0,
                rows: 0,
                state: [],

                message: ''
            }
        },
        beforeMount() {
            if (this.$mqtt.connected) {
                this.$mqtt.subscribe('2tp/workshop/slidingpuzzle/state')
            }
            else this.message = 'Websocket not connected'
        },
        methods: {
            shuffle() {
                this.solved = false;
                this.indexShuffle = 0;
                this.shuffleLoop();
                this.shuffling = true
            },
            shuffleLoop() {
                setTimeout(() => {
                    const actions = ['Down', 'Up', 'Left', 'Right'];

                    let random = Math.floor(Math.random() * (+4 - +0)) + +0;
                    this.count +=1;

                    this.switchNumbers(actions[random], 'shuffle');
                    this.indexShuffle += 1;

                    if(this.indexShuffle < 60) {
                        this.shuffleLoop()
                    } else this.shuffling = false
                }, 200)

            },
            getIndex(number) {
                if (this.grid[0][0] === number) {
                    return '0,0'
                }
                else if (this.grid[0][1] === number) {
                    return '0,1'
                }
                else if (this.grid[1][0] === number) {
                    return '1,0'
                }
                else if (this.grid[1][1] === number) {
                    return '1,1'
                }
            },
            switchNumbers(action, method) {
                console.log(this.grid)
                const firstIndex = this.getIndex(0).split(',');
                let secondIndex = '';

                switch (action) {
                    case 'Up': secondIndex = '0,' + firstIndex[1];
                        break;
                    case 'Down': secondIndex = '1,' + firstIndex[1];
                        break;
                    case 'Left': secondIndex = firstIndex[0] + ',0';
                        break;
                    case 'Right': secondIndex = firstIndex[0] + ',1';
                        break;
                }

                console.log(secondIndex)
                if (secondIndex !== '') {
                    this.grid[parseInt(firstIndex[0])][parseInt(firstIndex[1])] = this.grid[parseInt(secondIndex.split(',')[0])][parseInt(secondIndex.split(',')[1])]
                    this.grid[parseInt(secondIndex.split(',')[0])][parseInt(secondIndex.split(',')[1])] = 0
                }

                if (method === 'solve') {
                    this.solve()
                }
            },
            getColor(value) {
                if (value === 0) {
                    return 'white'
                }
            }
        },
        mqtt: {
            '2tp/workshop/slidingpuzzle/state' (data) {
                let json = JSON.parse(data)
                console.log(json)

                this.rows = json.nb_rows
                this.cols = json.nb_cols
                this.state = json.state
            }
        }
    }
</script>
