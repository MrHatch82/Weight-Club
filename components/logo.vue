<template>
  <div id="logo" class="text-center">
    <img src="/images/logo.png" alt="Fat Friends Logo">
    <div v-if="showSubtitle" class="subtitle" v-html="subtitle" />
  </div>
</template>

<script>
export default {
  props: {
    showSubtitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
        'Striving to be fit friends!',
        'Your loss!',
      ],
    };
  },
  computed: {
    subtitle() {
      return this.subtitles[Math.floor(Math.random() * this.subtitles.length)];
    },
  },
};
</script>

<style lang='scss'>
#logo {
  .subtitle {
    color: $tertiary;
  }

  img {
    width: 100%;
  }
}
</style>
