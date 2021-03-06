<template>
  <div ref="mo" class="month-overview" @mousemove="tooltipHover($event)" @mouseleave="tooltipHover(null)">
    <div
      v-for="(day, index) in monthWithFallback"
      :key="index"
      class="day"
      :data-index="index"
    >
      <div class="number" :style="`width: ${dayWidth};`" :class="{ weekend: isWeekend(day.date)}">
        {{ index + 1 }}
      </div>
      <div class="box" :data-index="index" :style="`width: ${dayWidth}; height: ${dayWidth}`" :class="{ weekend: isWeekend(day.date)}">
        <transition name="fade">
          <div v-if="day.exerciseLight && !day.exerciseHeavy" key="light" class="light" />
          <div v-if="!day.exerciseLight && day.exerciseHeavy" key="intense" class="intense" />
          <div v-if="day.exerciseLight && day.exerciseHeavy" key="both" class="both" />
        </transition>
      </div>
    </div>
    <tooltip ref="tooltip" :tooltip="tooltip" class="activity-tooltip text-left" />
  </div>
</template>

<script>
export default {
  props: {
    month: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      moWidth: 1140,
      tooltip: 'hui',
    };
  },
  computed: {
    monthWithFallback() {
      if (this.month.length) {
        return this.month;
      }
      const first = this.$dateTime.fromISO(this.selectedDate).startOf('month');
      return new Array(
        parseInt(this.$dateTime.fromISO(this.selectedDate).endOf('month').toFormat('d'))).fill(null).map((x, i) => {
        return {
          date: first.plus({ days: i }).toJSDate(),
          exerciseLight: false,
          exerciseHeavy: false,
        };
      },
      );
    },
    dayWidth() {
      if (this.$mq === 'xs' || this.$mq === 'sm') {
        return `${this.moWidth / 16}px`;
      }
      return `${this.moWidth / 31}px`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getMoWidth();

      window.addEventListener('resize', this.getMoWidth);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMoWidth);
  },
  methods: {
    getMoWidth() {
      if (this.$refs && this.$refs.mo) {
        this.moWidth = this.$refs.mo.offsetWidth;
      }
    },
    isWeekend(date) {
      const dayOfWeek = this.$dateTime.fromJSDate(date).weekday;
      if (dayOfWeek === 6 || dayOfWeek === 7) {
        return true;
      }
      return false;
    },
    tooltipHover(e) {
      if (e) {
        const day = this.monthWithFallback[e.target.dataset.index];

        if (!day) {
          this.$refs.tooltip.trigger();
          return;
        }

        if (day.exerciseLight && day.exerciseHeavy) {
          let tooltip = '<span class="text-primary">Heavy Exercise</span>';
          if (day.messageHeavy) {
            tooltip += `<br><span class="text-white">${day.messageHeavy}</span>`;
          }
          tooltip += '<br><br>Light Exercise';
          if (day.messageLight) {
            tooltip += `<br><span class="text-white">${day.messageLight}</span>`;
          }
          this.tooltip = tooltip;
        }
        if (day.exerciseLight && !day.exerciseHeavy) {
          let tooltip = 'Light Exercise';
          if (day.messageLight) {
            tooltip += `<br><span class="text-white">${day.messageLight}</span>`;
          }
          this.tooltip = tooltip;
        }
        if (!day.exerciseLight && day.exerciseHeavy) {
          let tooltip = '<span class="text-primary">Heavy Exercise</span>';
          if (day.messageHeavy) {
            tooltip += `<br><span class="text-white">${day.messageHeavy}</span>`;
          }
          this.tooltip = tooltip;
        }
        if (!day.exerciseLight && !day.exerciseHeavy) {
          this.tooltip = '<span class="text-white">No Exercise</span>';
        }
      }
      if (this.$refs && this.$refs.tooltip) {
        this.$refs.tooltip.trigger(e);
      }
    },
  },
};
</script>

<style lang="scss">
.month-overview {
    display: flex;
    flex-wrap: wrap;
    margin-right: -1px;

    @include media-breakpoint-up(lg) {
      flex-wrap: nowrap;
      margin-right: 0;
      margin-top: 0;
    }

    .number {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      font-weight: 400;
      pointer-events: none;
    }

    .box {
      border: 2px solid $dark;
      background: lighten($medium, 1%);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      border-radius: 0.2rem;

      &.weekend {
        background: darken($medium, 4%);
      }

      div {
        pointer-events: none;
      }

      .light {
        width: 65%;
        height: 65%;
        background: $tertiary;
        border-radius: 50%;
      }

      .intense {
        width: 65%;
        height: 65%;
        background: $primary;
        border-radius: 50%;
      }

      .both {
        width: 65%;
        height: 65%;
        background: $tertiary;
        border-radius: 50%;
        position: relative;
        overflow: hidden;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 52%;
          background: $primary;
          content: '';
        }
      }
    }

    .activity-tooltip {
      max-width: 250px;
    }
  }
</style>
