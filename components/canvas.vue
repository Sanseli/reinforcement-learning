<template>
  <div class="canvas-wrapper">
    <canvas
      ref="canvas"
      id="drawing-pad"
      width="450" height="450"
    ></canvas>
    <v-row style="margin: 0 2em;">
      <v-btn @click='resetCanvas'>Reset</v-btn>
      <v-spacer/>
      <v-btn @click='predict'>Predict</v-btn>
      <v-btn @click='replay'>Replay</v-btn>
    </v-row>

  </div>
</template>

<script>
    // src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.17/vue.min.js"
  export default {
      name: 'myCanvas',
      data() {
          return {
              canvas: null,
              context: null,
              isDrawing: false,
              startX: 0,
              startY: 0,
              points: [],
          }
      },
      mounted () {
          var vm = this
          vm.canvas = vm.$refs.canvas
          vm.context = vm.canvas.getContext("2d");
          vm.canvas.addEventListener('mousedown', vm.mousedown);
          vm.canvas.addEventListener('mousemove', vm.mousemove)
          document.addEventListener('mouseup', vm.mouseup);
      },
      methods: {
          mousedown(e) {
              var vm = this
              var rect = vm.canvas.getBoundingClientRect();
              var x = e.clientX - rect.left;
              var y = e.clientY - rect.top;

              vm.isDrawing = true;
              vm.startX = x;
              vm.startY = y;
              vm.points.push({
                  x: x,
                  y: y
              });
          },
          mousemove(e) {
              var vm = this
              var rect = vm.canvas.getBoundingClientRect();
              var x = e.clientX - rect.left;
              var y = e.clientY - rect.top;

              if (this.isDrawing) {
                  this.context.beginPath();
                  this.context.moveTo(vm.startX, vm.startY);
                  this.context.lineTo(x, y);
                  this.context.lineWidth = 1;
                  this.context.lineCap = 'round';
                  this.context.strokeStyle = "rgba(0,0,0,1)";
                  this.context.stroke();

                  this.startX = x;
                  this.startY = y;

                  this.points.push({
                      x: x,
                      y: y
                  });
              }
          },
          mouseup(e) {
              // var vm = this
              this.isDrawing = false;
              if (this.points.length > 0) {
                  localStorage['points'] = JSON.stringify(this.points);
              }
          },
          resetCanvas() {
              var vm = this
              vm.canvas.width = vm.canvas.width;
              this.points.length = 0; // reset points array
          },
          predict() {
              const context = this.canvas.getContext('2d');
              const imgData = new Uint8Array(context.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer);
              console.log(imgData)
              this.$emit('predict', imgData)
          },
          replay() {
              var vm = this
              vm.canvas.width = vm.canvas.width;

              // load localStorage
              if (vm.points.length === 0) {
                  if (localStorage["points"] !== undefined) {
                      vm.points = JSON.parse(localStorage["points"]);
                  }
              }

              var point = 1;
              setInterval(function () {
                  drawNextPoint(point);
                  point += 1;
              }, 10);

              function drawNextPoint(index) {
                  if (index >= vm.points.length) {
                      return;
                  }
                  var startX = vm.points[index - 1].x;
                  var startY = vm.points[index - 1].y;

                  var x = vm.points[index].x;
                  var y = vm.points[index].y;

                  vm.context.beginPath();
                  vm.context.moveTo(startX, startY);
                  vm.context.lineTo(x, y);
                  vm.context.lineWidth = 1;
                  vm.context.lineCap = 'round';
                  vm.context.strokeStyle = "rgba(0,0,0,1)";
                  vm.context.stroke();
              }
          },
      }
  }
</script>

<style>
  canvas {
    border: 1px solid black;
    cursor:crosshair;
    background-color: #F5F5F5;
    margin: 1em;
  }
</style>
