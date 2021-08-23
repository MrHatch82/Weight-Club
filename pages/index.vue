<template>
  <div class="container text-center pt-5">
    <div class="mb-5">
      <h1>WEIGHT CLUB</h1>
      <div v-if="rando !== false" class="subtitle" v-html="subtitles[rando]" />
    </div>
    <chart-line :data="chart" :options="options" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      rando: false,
      subtitles: [
        'Get off your bum!',
        'Competitive weight loss made easy!',
        'Have you tried not eating so much?',
        "You got fat by sitting in a chair all day? Who'd've thought!",
        'Now with extra stats!',
        "If you can read this, you're too heavy!",
        "Wouldn't it be nice to see those toes again?",
        'Lose to win!',
        'Move it, you fat f*ck!'
      ],
      chart: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: 'Peter',
            data: [130, 129, 129, 128, 127, null],
            borderColor: 'rgb(255, 0, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          },
          {
            label: 'Paul',
            data: [122, 123, 123, null, 122, 121],
            borderColor: 'rgb(255, 255, 0)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          }
        ]
      },
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }
  },
  mounted() {
    this.rando = Math.floor(Math.random() * this.subtitles.length)
  }
}
</script>

<style lang='scss'>
.subtitle {
  color: #aaa;
}
</style>
