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
          <div v-if="day.activityLight && !day.activityIntense" key="light" class="light" />
          <div v-if="!day.activityLight && day.activityIntense" key="intense" class="intense" />
          <div v-if="day.activityLight && day.activityIntense" key="both" class="both" />
        </transition>
      </div>
    </div>
    <tooltip ref="tooltip" parent-ref-title="mo" :tooltip="tooltip" />
  </div>
</template>

<script>
import Moment from 'moment';
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
      return new Array(
        Moment().daysInMonth()).fill(null).map((x, i) => {
        const date = Moment().startOf('month').add(i, 'days');

        return {
          date,
          activityLight: false,
          activityIntense: false,
        };
      },
      );
    },
    dayWidth() {
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
      const dayOfWeek = this.$moment(date).day();
      if (dayOfWeek % 6 === 0) {
        return true;
      }
      return false;
    },
    tooltipHover(e) {
      if (e) {
        const day = this.monthWithFallback[e.target.dataset.index];

        if (day.activityLight && day.activityIntense) {
          this.tooltip = '<span class="text-primary">Heavy Exercise</span><br>& Light Exercise';
        }
        if (day.activityLight && !day.activityIntense) {
          this.tooltip = 'Light Exercise';
        }
        if (!day.activityLight && day.activityIntense) {
          this.tooltip = 'Heavy Exercise';
        }
        if (!day.activityLight && !day.activityIntense) {
          this.tooltip = '<span class="text-white">No Exercise</span>';
        }
      }
      this.$refs.tooltip.trigger(e);
    },
  },
};
</script>

<style lang="scss">
.month-overview {
    display: flex;

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
  }
</style>
