<template>
  <v-container fluid style="padding:0">
    <v-sparkline
      :fill="fill"
      :gradient="selectedGradient"
      :line-width="width"
      :padding="padding"
      :smooth="radius || false"
      :value="value"
      auto-draw
    ></v-sparkline>
  </v-container>
</template>

<script>
const gradients = [
  ["#0FB551"],
  ["#C42300"],
  ["#39AEE0"],
  ["#FF922E"]
]

export default {
  data: () => ({
    fill: false,
    selectedGradient: gradients[0],
    gradients,
    padding: 0,
    radius: 0,
    value: [0, 6, 3, 4, 8, 8, 5, 4, 3, 6, 7, 9],
    width: 10
  })
}
</script>
