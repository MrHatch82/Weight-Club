<template>
  <div class="container text-center pt-5">
    <h1>WEIGHT CLUB</h1>
    <div v-if="rando !== false" class="subtitle" v-html="subtitles[rando]" />
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
      ]
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
