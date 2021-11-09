<template>
  <div class="date-picker row">
    <div v-if="dayPicker" class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up" @click="dateSubtract({ days: 1 })">
          <svg height="15" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentDay }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="$dateTime.fromISO(selectedDate) >= $dateTime.now().startOf('day')"
          @click="dateAdd({ days: 1 })"
        >
          <svg height="14" width="12"><polygon points="0,0 12,7 0,14" /></svg>
        </button>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up" @click="dateSubtract({months: 1})">
          <svg height="14" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentMonth }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentMonth === $dateTime.now().toFormat($mq === 'xs' || $mq === 'sm' ? 'MMM' : 'MMMM') && currentYear === $dateTime.now().toFormat('yyyy')"
          @click="dateAdd({ months: 1 })"
        >
          <svg height="14" width="12"><polygon points="0,0 12,7 0,14" /></svg>
        </button>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button
          class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up"
          @click="dateSubtract({ years: 1 })"
        >
          <svg height="14" width="12"><polygon points="12,0 0,7 12,14" /></svg>
        </button>
        {{ currentYear }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentYear === $dateTime.now().toFormat('yyyy')"
          @click="dateAdd({ years: 1 })"
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
      selectedDate: this.$dateTime.now().toFormat('yyyyMMdd'),
    };
  },
  computed: {
    currentDay() {
      if (this.$mq === 'xs' || this.$mq === 'sm') {
        return `${this.$dateTime.fromISO(this.selectedDate).toFormat('d')}.`;
      }
      return `${this.$dateTime.fromISO(this.selectedDate).toFormat('cccc')}, ${this.$dateTime.fromISO(this.selectedDate).toFormat('d')}.`;
    },
    currentMonth() {
      if (this.$mq === 'xs' || this.$mq === 'sm') {
        return this.$dateTime.fromISO(this.selectedDate).toFormat('MMM');
      }
      return this.$dateTime.fromISO(this.selectedDate).toFormat('MMMM');
    },
    currentYear() {
      return this.$dateTime.fromISO(this.selectedDate).toFormat('yyyy');
    },
    daysInMonth() {
      const first = this.$dateTime.fromISO(this.selectedDate).startOf('month');
      return new Array(parseInt(first.endOf('month').toFormat('dd'))).fill(null).map((x, i) => first.plus({ days: i }));
    },
  },
  methods: {
    dateAdd(val) {
      this.selectedDate = this.$dateTime.fromISO(this.selectedDate).plus(val).toFormat('yyyyMMdd');
      if (this.$dateTime.fromISO(this.selectedDate) > this.$dateTime.now()) {
        this.selectedDate = this.$dateTime.now().toFormat('yyyyMMdd');
      }
      this.$emit('dateChanged', this.selectedDate);
    },
    dateSubtract(val) {
      this.selectedDate = this.$dateTime.fromISO(this.selectedDate).minus(val).toFormat('yyyyMMdd');
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
