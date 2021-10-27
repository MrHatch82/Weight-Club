<template>
  <div id="logo" class="text-center">
    <logo-img alt="Fat Friends Logo" title="Fat Friends Logo" />
    <transition name="fade">
      <div v-if="showSubtitle && !switcher" key="subtitles[subtitle]" class="subtitle" v-html="subtitles[subtitle]" />
      <div v-if="showSubtitle && switcher" key="subtitles[nextSubtitle]" class="subtitle" v-html="subtitles[nextSubtitle]" />
    </transition>
  </div>
</template>

<script>
import LogoImg from '~/assets/svg/logo.svg?inline';
export default {

  components: { LogoImg },
  props: {
    showSubtitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      subtitle: 0,
      nextSubtitle: 0,
      switcher: false,
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
        'Start losing and stick to it!',
        'Defeat your inner pigdog!',
        'Oh lawd, they coming!',
        'Less Dota, more sports!',
        'Look at them run!',
        'How about a healthy snack for a change?',
        'Stop stuffing your face with crap!',
        'Take back control!',
        'Chonk no more!',
      ],
    };
  },
  mounted() {
    if (this.showSubtitle) {
      this.subtitle = Math.floor(Math.random() * this.subtitles.length);
      setInterval(() => {
        if (this.switcher) {
          this.subtitle = Math.floor(Math.random() * this.subtitles.length);
        } else {
          this.nextSubtitle = Math.floor(Math.random() * this.subtitles.length);
        }
        this.switcher = !this.switcher;
      }, 3500);
    }
  },
};
</script>

<style lang='scss'>
#logo {
  .subtitle {
    color: $tertiary;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  img {
    width: 100%;
  }
}
</style>
