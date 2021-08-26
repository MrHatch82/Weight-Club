<template>
  <div class="container text-center my-5">
    <h1>FAT FRIENDS</h1>
    <div class="subtitle" v-html="subtitle" />
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
        'Now with extra stats!',
        "If you can read this, you're too heavy!",
        "Wouldn't it be nice to see those toes again?",
        'With us you have to lose to win!',
        'Our motto: <b>LTG</b> - Lower Thy Groceries!',
        'Burn it, baby!',
        'What have you got to lose?',
        'Lose & schmoose',
        'Your loss!'
      ]
    }
  },
  computed: {
    subtitle() {
      if (this.rando) {
        return this.subtitles[this.rando]
      }
      return '...'
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
