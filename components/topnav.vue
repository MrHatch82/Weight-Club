<template>
  <div id="topnav" :class="{ show: $route.path !== '/' || settingsReady }">
    <nuxt-link to="/">
      <logo class="logo" />
    </nuxt-link>
    <div class="toggle" :class="{ active: menuToggled }" @click="menuToggled = !menuToggled">
      <span class="bar" />
      <span class="bar" />
      <span class="bar" />
      <span class="bar" />
    </div>
    <div class="container text-right">
      <div class="menu" :class="{ toggled: menuToggled}">
        <nuxt-link to="/friends-ranking" :class="{ disabled: !settingsReady}" class="tab">
          friends ranking
        </nuxt-link>
        <nuxt-link to="/weight-tracking" :class="{ disabled: !settingsReady}" class="tab">
          weight tracking
        </nuxt-link>
        <nuxt-link to="/exercises-chat" :class="{ disabled: !settingsReady}" class="tab position-relative" @click.native="newMessage = false">
          Exercises / Chat
          <div v-if="newMessage" class="message-indicator"></div>
        </nuxt-link>
        <nuxt-link to="/nutrition-log" :class="{ disabled: !settingsReady}" class="tab">
          Nutrition log
        </nuxt-link>
        <nuxt-link to="/user-settings" class="tab d-lg-none">
          Settings
        </nuxt-link>
      </div>
    </div>
    <nuxt-link to="/user-settings" class="settings d-none d-lg-block">
      <gear />
    </nuxt-link>
  </div>
</template>

<script>
import Gear from '~/assets/svg/gear.svg?inline';
export default {

  components: { Gear },
  data() {
    return {
      newMessage: false,
      menuToggled: false,
    };
  },
  computed: {
    settingsReady() {
      const state = this.$store.state;
      return state.userSettingsId && state.weightGoal && state.weightStart;
    },
  },
  mounted() {
    this.$nuxt.$on('routeChanged', () => {
      setTimeout(() => {
        this.menuToggled = false;
      }, 200);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('routeChanged');
  },
  methods: {
    messageReceived() {
      this.newMessage = this.$route.path !== '/exercises-chat';
    },
  },
};
</script>

<style lang="scss">
#topnav {
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  height: $topnavHeightMobile;
  width: 100%;
  padding: 0.25rem;
  background: #222;
  transform: translateY(-100%);
  transition: transform 0.5s 0.5s ease-in-out;
  z-index: 20;
  box-shadow: inset 0px -1px 0px 0px rgba(255,255,255,0.15);

  @include media-breakpoint-up(lg) {
    padding: 1rem;
    height: $topnavHeight;
    overflow: hidden;
  }

  &.show {
  transform: translateY(0);
  }

  .logo {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 50px;

    @include media-breakpoint-up(lg) {
      top: 1rem;
      left: 1rem;
      width: 60px;
    }

  }

  .toggle {
    width: 30px;
    height: 40px;
    position: absolute;
    top: 0.4rem;
    right: 0.5rem;

    @include media-breakpoint-up(lg) {
      display: none;
    }

    .bar {
      display: block;
      width: 30px;
      height: 3px;
      background: $tertiary;
      position: absolute;
      left: 0;
      top: 9px;
      transition: width 0.3s, transform 0.3s;
      border-radius: 2px;

      &:nth-child(1),
      &:nth-child(4) {
        left: 50%;
        transform: translateX(-50%);
      }

      &:nth-child(2),
      &:nth-child(3) {
        top: 17px;
      }

      &:nth-child(4) {
        top: 25px;
      }
    }

    &.active {
      .bar {
        &:nth-child(1),
        &:nth-child(4) {
          width: 0;
        }

        &:nth-child(2) {
          transform: rotate(45deg);
        }

        &:nth-child(3) {
          transform: rotate(-45deg);
        }
      }
    }
  }

  .settings {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 39px;
    height: 39px;

    & > svg {
      width: 100%;
      height: 100%;

      path {
        transition: fill 0.25s;
      }
    }

    &:hover {
      animation: spin2 3s linear infinite;
    }

    &.nuxt-link-active {
      animation: spin2 3s linear infinite;

      & > svg path {
      fill: $tertiary !important;
      }
    }
  }

  .menu {
    opacity: 0;
    position: absolute;
    top: $topnavHeightMobile;
    left: 100vw;
    width: 100vw;
    height: calc(100vh - #{$topnavHeightMobile});
    background: $dark;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s, opacity 0.3s 0.3s;

    @include media-breakpoint-up(lg) {
      opacity: 1;
      position: relative;
      top: 0;
      left: 0;
      width: auto;
      height: auto;
      background: transparent;
      display: block;
      transition: none;
    }

    &.toggled {
      opacity: 1;
      transform: translateX(-100%);
      transition: transform 0.5s;

      @include media-breakpoint-up(lg) {
        transform: none;
        transition: none;
      }
    }
  }

  .tab {
    display: inline-block;
    padding: 1rem 1rem 1rem;
    min-width: 200px;
    text-transform: uppercase;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.75px;
    cursor: pointer;
    color: darken($light, 15%);
    text-decoration: none;
    text-align: center;
    margin: -1rem 0 1rem;

    @include media-breakpoint-up(lg) {
      padding: 1rem 1rem 1px;
      margin: 0 0.25rem -1rem;
      border-radius: 6px 6px 0 0;
      background: #2d2d2d;
      transition: padding 0.25s ease-in-out, color 0.25s, background 0.25s, box-shadow 0.25s , transform 0.25s ease-in-out;
      text-align: left;
      transform: translateY(0.75rem);
      box-shadow: inset 0px -18px 25px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
    }

    &:hover {
      color: $secondary;
    }

    &.nuxt-link-active {
      background: $dark;
      color: $secondary;
      cursor: default;

      @include media-breakpoint-up(lg) {
        padding: 1rem;
        transform: translateY(0);
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0px -5px 5px -4px rgba(0,0,0,0);
      }
    }

    &.disabled {
      pointer-events: none;
      cursor: default;
      color: transparent;
    }
  }

  .message-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $primary;
  }
}
</style>
