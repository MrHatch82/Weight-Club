<template>
  <div ref="tooltip" class="tooltip" :class="[{ show: showTooltip }, textColor]" v-html="tooltip" />
</template>

<script>
export default {
  props: {
    parentRefTitle: String, // eslint-disable-line
    tooltip: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: 'primary',
    },
  },
  data() {
    return {
      showTooltip: false,
      parentEl: null,
    };
  },
  mounted() {
    this.parentEl = this.$parent.$refs[this.parentRefTitle];
  },
  methods: {
    trigger(e) {
      if (e) {
        this.showTooltip = true;
        const rect = this.parentEl.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;
        const translateX = e.clientX - offsetX;
        const translateY = e.clientY - offsetY;
        this.$refs.tooltip.style.transform = `translate(${translateX}px, ${translateY - 2}px) translate(-50%, -100%)`;
      }

      if (!e && this.showTooltip) {
        this.showTooltip = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    background: rgba(0,0,0,0.7);
    padding: 0.25rem 0.6rem 0.4rem;
    color: $white;
    border-radius: 7px;
    font-weight: 600;
    color: $tertiary;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-align: center;
    transform: translateX(-50%);
    pointer-events: none;
    line-height: 1.2;

    &.secondary {
      color: $secondary;
    }

    &.tertiary {
      color: $tertiary;
    }

    &.show {
      display: block;
    }
  }
</style>
