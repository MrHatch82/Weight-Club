<template>
  <div id="topnav" :class="{ show: $route.path !== '/'}">
    <logo class="logo" />
    <div class="container text-right">
      <nuxt-link to="/weight-tracking" :class="{ disabled: !settingsReady}" class="tab">
        weight tracking
      </nuxt-link>
      <nuxt-link to="/friends" :class="{ disabled: !settingsReady}" class="tab">
        friends
      </nuxt-link>
      <nuxt-link to="/activities" :class="{ disabled: !settingsReady}" class="tab position-relative" @click.native="newMessage = false">
        Activities / Chat
        <div v-if="newMessage" class="message-indicator"></div>
      </nuxt-link>
      <nuxt-link to="/food-diary" :class="{ disabled: !settingsReady}" class="tab">
        food diary
      </nuxt-link>
    </div>
    <nuxt-link to="/user-settings" class="settings">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="1280.000000pt"
        height="1280.000000pt"
        viewBox="0 0 1280.000000 1280.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
          fill="#555555"
          stroke="none"
        >
          <path
            d="M6017 12789 c-251 -15 -621 -59 -867 -104 -47 -8 -115 -20 -153 -27
l-67 -12 -20 -66 c-33 -111 -116 -417 -159 -584 -23 -88 -43 -160 -44 -161 -1
-1 -65 -23 -142 -49 -210 -72 -418 -158 -626 -258 l-186 -90 -169 100 c-231
137 -543 312 -556 312 -15 0 -242 -156 -413 -285 -567 -426 -1043 -911 -1462
-1490 -104 -145 -203 -292 -203 -304 0 -10 195 -357 327 -580 l85 -144 -86
-176 c-95 -197 -199 -449 -266 -648 l-44 -132 -41 -10 c-22 -6 -150 -40 -285
-76 -135 -35 -299 -80 -365 -98 l-120 -34 -7 -39 c-118 -656 -142 -902 -142
-1434 0 -477 25 -766 105 -1220 17 -96 33 -192 36 -212 5 -37 7 -38 74 -58
163 -47 218 -63 474 -130 148 -39 270 -72 270 -73 1 -1 23 -65 49 -142 72
-210 158 -418 258 -627 l90 -186 -64 -109 c-160 -268 -348 -600 -348 -615 0
-14 153 -236 278 -403 405 -541 842 -979 1377 -1381 182 -137 408 -294 423
-294 11 0 352 192 581 327 l144 85 166 -80 c249 -121 503 -224 718 -293 69
-22 72 -24 82 -63 143 -541 205 -764 213 -770 6 -5 312 -58 471 -81 685 -99
1309 -99 1994 0 160 23 465 76 472 81 6 5 69 230 146 523 42 157 77 286 78
287 1 1 58 20 125 43 246 84 408 150 663 273 l166 80 144 -85 c229 -135 570
-327 581 -327 15 0 241 157 422 293 530 399 964 833 1363 1363 136 181 293
407 293 422 0 12 -131 247 -278 497 -58 99 -112 191 -120 205 -14 24 -11 32
42 138 112 223 260 584 322 785 16 52 21 58 53 66 438 112 753 200 768 215 21
21 98 498 127 786 67 667 39 1282 -92 2004 l-27 149 -120 34 c-66 18 -230 63
-365 98 -135 36 -263 70 -285 76 l-41 10 -44 132 c-67 199 -171 451 -266 648
l-86 176 85 144 c135 229 327 570 327 581 0 15 -158 244 -285 413 -403 535
-845 977 -1380 1380 -170 128 -398 285 -413 285 -13 0 -325 -175 -556 -312
l-169 -100 -186 90 c-208 100 -416 186 -626 258 -77 26 -141 48 -142 49 -1 0
-32 113 -68 250 -99 377 -146 539 -158 551 -25 24 -468 96 -787 129 -333 34
-748 43 -1063 24z m635 -4918 c539 -93 990 -478 1163 -994 57 -172 69 -255 69
-477 0 -222 -12 -305 -69 -477 -146 -435 -504 -792 -940 -938 -173 -58 -253
-69 -475 -69 -222 0 -302 11 -475 69 -436 146 -794 503 -940 938 -49 147 -66
251 -72 432 -4 143 -2 189 15 290 108 627 590 1115 1212 1225 146 26 363 26
512 1z"
          />
        </g>
      </svg>
    </nuxt-link>
  </div>
</template>

<script>
export default {
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

      g {
        transition: fill 0.25s;
      }
    }

    &:hover {
      animation: spin2 3s linear infinite;
    }

    &.nuxt-link-active {
      animation: spin2 3s linear infinite;

      & > svg g {
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
