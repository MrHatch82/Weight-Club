<template>
  <div id="topnav" :class="{ show: $route.path !== '/'}">
    <logo class="logo" />
    <div class="container text-right">
      <nuxt-link to="/weight-tracking" class="tab">
        weight tracking
      </nuxt-link>
      <nuxt-link to="/ranking" class="tab">
        ranking
      </nuxt-link>
      <nuxt-link to="/activities" class="tab">
        Activities / Chat
      </nuxt-link>
      <nuxt-link to="/food-diary" class="tab">
        food diary
      </nuxt-link>
    </div>
  </div>
</template>

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

  &.show {
  transform: translateY(0);
  }

  .logo {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 60px;
  }

  .tab {
    display: inline-block;
    padding: 1rem 1rem 0.5rem;
    min-width: 200px;
    margin: 0 0.25rem -1rem;
    border-radius: 6px 6px 0 0;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: #2d2d2d;
    cursor: pointer;
    box-shadow: inset 0px -5px 5px -4px rgba(0,0,0,0.15);
    transition: padding 0.25s ease-in-out, color 0.25s, background 0.25s 0.25s, box-shadow 0.25s 0.25s , transform 0.25s ease-in-out;
    color: darken($light, 15%);
    text-decoration: none;
    text-align: left;
    transform: translateY(0.5rem);

    &:hover {
      color: $tertiary;
    }

    &.nuxt-link-active {
      padding: 1rem;
      background: $dark;
      color: $light;
      transform: translateY(0);
      box-shadow: inset 0px -5px 5px -4px rgba(0,0,0,0);
      cursor: default;
    }
  }
}
</style>
