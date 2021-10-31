<template>
  <div class="date-picker row">
    <div v-if="dayPicker" class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up" @click="dateSubtract(1, 'day')">
          <svg height="15" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentDay }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="$moment(selectedDate).isSame($moment(), 'day')"
          @click="dateAdd(1, 'day')"
        >
          <svg height="14" width="12"><polygon points="0,0 12,7 0,14" /></svg>
        </button>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up" @click="dateSubtract(1, 'month')">
          <svg height="14" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentMonth }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentMonth === $moment().format($mq === 'xs' || $mq === 'sm' ? 'MMM' : 'MMMM') && currentYear === $moment().format('YYYY')"
          @click="dateAdd(1, 'month')"
        >
          <svg height="14" width="12"><polygon points="0,0 12,7 0,14" /></svg>
        </button>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button
          class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up"
          @click="dateSubtract(1, 'year')"
        >
          <svg height="14" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentYear }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentYear === $moment().format('YYYY')"
          @click="dateAdd(1, 'year')"
        >
          <svg height="14" width="12"><polygon points="0,0 12,7 0,14" /></svg>
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    dayPicker: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedDate: this.$moment().format('YYYYMMDD'),
    };
  },
  computed: {
    currentDay() {
      if (this.$mq === 'xs' || this.$mq === 'sm') {
        return `${this.$moment(this.selectedDate).format('D')}.`;
      }
      return `${this.$moment(this.selectedDate).format('dddd')}, ${this.$moment(this.selectedDate).format('D')}.`;
    },
    currentMonth() {
      if (this.$mq === 'xs' || this.$mq === 'sm') {
        return this.$moment(this.selectedDate).format('MMM');
      }
      return this.$moment(this.selectedDate).format('MMMM');
    },
    currentYear() {
      return this.$moment(this.selectedDate).format('YYYY');
    },
    daysInMonth() {
      return new Array(this.$moment(this.selectedDate).daysInMonth()).fill(null).map((x, i) => this.$moment(this.selectedDate).startOf('month').add(i, 'days'));
    },
  },
  methods: {
    dateAdd(number, unit) {
      this.selectedDate = this.$moment(this.selectedDate).add(number, unit).format('YYYYMMDD');
      if (this.$moment(this.selectedDate).isAfter()) {
        this.selectedDate = this.$moment().format('YYYYMMDD');
      }
      this.$emit('dateChanged', this.selectedDate);
    },
    dateSubtract(number, unit) {
      this.selectedDate = this.$moment(this.selectedDate).subtract(number, unit).format('YYYYMMDD');
      this.$emit('dateChanged', this.selectedDate);
    },
    dateSet(newDate) {
      this.selectedDate = newDate;
    },
  },
};
</script>

<style lang="scss">
  .datepicker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $tertiary;
    font-weight: 600;
    letter-spacing: 1px;
    background: #272727;
    height: 38px;
    text-transform: uppercase;

    .btn {
      font-size: 1rem;
      height: 38px;
      width: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }
</style>
