<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-center">
        <my-canvas @predict="predict" v-if="canvasActive"></my-canvas>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
    import myCanvas from "../components/canvas";

    export default {
        data() {
            return {
                canvasActive: false
            }
        },
        components: {
            myCanvas
        },
        methods: {
            predict(data) {
                let tf = document.createElement('script');
                tf.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.14.1/dist/tf.min.js')

                const preds = model.predict(tf.tensor(data).reshape([1, 64, -1]))
                const { values, indices } = tf.topk(preds, 3)
                tf.loadModel('./model/model.json')
            }
        }
    }
</script>
