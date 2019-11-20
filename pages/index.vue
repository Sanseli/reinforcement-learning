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
        <my-canvas></my-canvas>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import myCanvas from "../components/canvas";

export default {
  components: {
      myCanvas
  }
}
</script>
