<template>
  <div :class="{show: show}" class="popup">
    <div class="popup-overlay" @click="toggle" />
    <div class="popup-window shadow-up">
      <div class="header shadow-up-top">
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
    title: { type: String, default: '' },
    emitId: { type: String, default: '' },
  },
  data() {
    return {
      show: false,
    };
  },
  mounted() {
    window.addEventListener('keydown', this.keydown);
  },
  methods: {
    toggle() {
      this.show = !this.show;

      if (this.show && this.emitId) {
        this.$nuxt.$emit(this.emitId);
      }
    },
    keydown(event) {
      if (event.key === 'Escape') {
        this.show = false;
      }
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
  z-index: 21;
  opacity: 0;
  transition: opacity 0.2s linear;
  pointer-events: none;

  .popup-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(3px);
  }

  .popup-window {
    background: $dark;
    border-radius: 0.25rem;
    min-width: 300px;
    transform: scale(0.9);
    transition: transform 0.2s ease-out;

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
      transition: transform 0.2s;

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
