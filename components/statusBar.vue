<template>
  <div class="status-bar">
    <div class="status-bar-container shadow-down">
      <div ref="statusBar" class="status-bar-before" @mousemove="tooltipHover($event)" @mouseleave="showTooltip = false">
        <div class="status-bar-month" :style="`width: ${monthPercent}%;`" />
      </div>
    </div>
    <div ref="tooltip" class="tooltip" :class="{ show: showTooltip, month: tooltipMonth }" v-html="tooltip">
    </div>
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
      showTooltip: false,
      tooltipMonth: false,
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
      this.showTooltip = true;
      this.tooltipMonth = e.target !== this.$refs.statusBar;
      this.tooltip = e.target === this.$refs.statusBar ? 'Weight loss in<br>previous months' : 'Weight loss<br>this month';
      const rect = this.$refs.statusBar.getBoundingClientRect();
      const offsetX = rect.left;
      const offsetY = rect.top;
      const translateX = e.clientX - offsetX;
      const translateY = e.clientY - offsetY;
      this.$refs.tooltip.style.transform = `translate(${translateX}px, ${translateY - 2}px) translate(-50%, -100%)`;
    },
  },
};
</script>

<style lang="scss">
.status-bar {
  position: relative;

  .status-bar-container {
      border-radius: 0.25rem;
      height: 1.25rem;
      width: 100%;
      background: $darker;
      overflow: hidden;
      position: relative;
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

    &.month {
      color: $secondary;
    }

    &.show {
      display: block;
    }
  }
}
</style>
