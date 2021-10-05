<template>
  <div ref="mo" class="month-overview">
    <div
      v-for="(day, index) in month"
      :key="index"
      class="day"
    >
      <div class="number" :style="`width: ${dayWidth};`" :class="{ weekend: isWeekend(day.date)}">
        {{ index + 1 }}
      </div>
      <div class="box" :style="`width: ${dayWidth}; height: ${dayWidth}`" :class="{ weekend: isWeekend(day.date)}">
        <transition name="fade">
          <div v-if="day.activityLight && !day.activityIntense" key="light" class="light" />
          <div v-if="!day.activityLight && day.activityIntense" key="intense" class="intense" />
          <div v-if="day.activityLight && day.activityIntense" key="both" class="both" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    month: {
      type: Array,
      default: () => { return []; },
    },
  },
  data() {
    return {
      moWidth: 1140,
    };
  },
  computed: {
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
      const dayOfWeek = date.day();
      if (dayOfWeek % 6 === 0) {
        return true;
      }
      return false;
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
