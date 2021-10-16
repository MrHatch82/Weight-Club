<template>
  <div class="status-bar">
    <div class="status-bar-container shadow-down">
      <div ref="statusBar" class="status-bar-before" @mousemove="tooltipHover($event)" @mouseleave="tooltipHover(null)">
        <div class="status-bar-month" :style="`width: ${monthPercent}%;`" />
      </div>
    </div>
    <tooltip ref="tooltip" :tooltip="tooltip" :text-color="tooltipColor" />
  </div>
</template>

<script>
export default {
  props: {
    percent: { type: Number, default: 0 },
    monthPercent: { type: Number, default: 0 },
  },
  data() {
    return {
      tooltipColor: 'primary',
      tooltip: '',
    };
  },
  watch: {
    percent() {
      this.$refs.statusBar.style.width = `${this.percent}%`;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$refs.statusBar.style.width = `${this.percent}%`;
    }, 50);
  },
  methods: {
    tooltipHover(e) {
      if (e) {
        this.tooltipColor = e.target === this.$refs.statusBar ? 'primary' : 'secondary';
        this.tooltip = e.target === this.$refs.statusBar ? 'Weight loss in<br>previous months' : 'Weight loss<br>this month';
      }
      if (this.$refs && this.$refs.tooltip) {
        this.$refs.tooltip.trigger(e);
      }
    },
  },
};
</script>

<style lang="scss">
.status-bar {
  position: relative;

  .status-bar-container {
      border-radius: 0.25rem;
      height: 0.8rem;
      width: 100%;
      background: $darker;
      overflow: hidden;
      position: relative;

      @include media-breakpoint-up(lg) {
        height: 1.25rem;
      }
  }

  .status-bar-before {
    position: absolute;
    left: 0;
    top: 1px;
    background: $tertiary;
    height: calc(100% - 3px);
    width: 0;
    transition: width .5s;
    box-shadow: inset 0 4px 4px 0px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px 0px rgba(0, 0, 0, 0.2);
  }

  .status-bar-month {
    position: absolute;
    right: 0;
    top: 0;
    background: $secondary;
    height: 100%;
    width: 0;
    box-shadow: inset 0 4px 4px 0px rgba(0, 0, 0, 0.35),
    inset 0 1px 1px 0px rgba(0, 0, 0, 0.4);
  }
}
</style>
