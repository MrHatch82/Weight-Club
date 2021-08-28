<template>
  <div id="topnav" :class="{ show: $route.path !== '/'}">
    <logo class="logo" />
  </div>
</template>

<style lang="scss">
#topnav {
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

  &.show {
  transform: translateY(0);
  }

  .logo {
    width: 60px;
  }
}
</style>
