<template>
  <div :class="{show: show}" class="popup">
    <div class="popup-window">
      <div class="header">
        {{ title }}
        <div class="close-btn" @click="toggle" />
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    },
  },
};
</script>

<style lang="scss">
.popup {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 21;
  opacity: 0;
  transition: opacity 0.25s linear;
  pointer-events: none;

  .popup-window {
    background: $dark;
    border-radius: 0.25rem;
    min-width: 300px;
    transform: scale(0.9);
    transition: transform 0.25s ease-out;

    .header {
      display: flex;
      justify-content: space-between;
      background: $primary;
      color: $secondary;
      font-weight: 600;
      text-transform: uppercase;
      padding: 0.25rem 0.5rem;
      text-align: left;
      border-radius: 0.25rem 0.25rem 0 0;
    }

    .close-btn {
      width: 24px;
      height: 24px;
      position: relative;
      cursor: pointer;
      transform: scale(0.9);
      transition: transform 0.25s;

      &:hover {
        transform: scale(1);
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 10px;
        width: 4px;
        height: 24px;
        background: $tertiary;
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }

    .content {
    padding: 2rem;

    }
  }

  &.show {
    opacity: 1;
    pointer-events: all;

      .popup-window {
        transform: scale(1);
      }
    }
}
</style>
