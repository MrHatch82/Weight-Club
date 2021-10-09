<template>
  <div id="topnav" :class="{ show: $route.path !== '/'}">
    <logo class="logo" />
    <div class="container text-right">
      <nuxt-link to="/friends" :class="{ disabled: !settingsReady}" class="tab">
        friends ranking
      </nuxt-link>
      <nuxt-link to="/weight-tracking" :class="{ disabled: !settingsReady}" class="tab">
        weight tracking
      </nuxt-link>
      <nuxt-link to="/activities" :class="{ disabled: !settingsReady}" class="tab position-relative" @click.native="newMessage = false">
        Activities / Chat
        <div v-if="newMessage" class="message-indicator"></div>
      </nuxt-link>
      <nuxt-link to="/food-diary" :class="{ disabled: !settingsReady}" class="tab">
        Nutrition diary
      </nuxt-link>
    </div>
    <nuxt-link to="/user-settings" class="settings">
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
    };
  },
  computed: {
    settingsReady() {
      const state = this.$store.state;
      return state.userSettingsId && state.weightGoal && state.weightStart;
    },
  },
  methods: {
    messageReceived() {
      this.newMessage = this.$route.path !== '/activities';
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
  height: $topnavHeight;
  width: 100%;
  padding: 1rem;
  background: #222;
  transform: translateY(-100%);
  transition: transform 0.5s 0.5s ease-in-out;
  z-index: 20;
  overflow: hidden;
box-shadow: inset 0px -1px 0px 0px rgba(255,255,255,0.15);

  &.show {
  transform: translateY(0);
  }

  .logo {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 60px;
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

  .tab {
    display: inline-block;
    padding: 1rem 1rem 1px;
    min-width: 200px;
    margin: 0 0.25rem -1rem;
    border-radius: 6px 6px 0 0;
    text-transform: uppercase;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.75px;
    background: #2d2d2d;
    cursor: pointer;
    transition: padding 0.25s ease-in-out, color 0.25s, background 0.25s, box-shadow 0.25s , transform 0.25s ease-in-out;
    color: darken($light, 15%);
    text-decoration: none;
    text-align: left;
    transform: translateY(0.75rem);
    box-shadow: inset 0px -18px 25px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);

    &:hover {
      color: $secondary;
    }

    &.nuxt-link-active {
      padding: 1rem;
      background: $dark;
      color: $secondary;
      transform: translateY(0);
      box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1), inset 0px -5px 5px -4px rgba(0,0,0,0);
      cursor: default;
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
