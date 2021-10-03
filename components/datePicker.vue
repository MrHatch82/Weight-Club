<template>
  <div class="date-picker row">
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up" @click="dateSubtract(1, 'month')">
          ◀
        </button>
        {{ currentMonth }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentMonth === $moment().format('MMMM') && currentYear === $moment().format('YYYY')"
          @click="dateAdd(1, 'month')"
        >
          ▶
        </button>
      </div>
    </div>
    <div class="col-md-6 col-lg-3 mb-4">
      <div class="datepicker shadow-down">
        <button
          class="btn btn-primary btn-sm mr-2 btn-arrow shadow-up"
          @click="dateSubtract(1, 'year')"
        >
          ◀
        </button>
        {{ currentYear }}
        <button
          class="btn btn-primary btn-sm ml-2 btn-arrow shadow-up"
          :disabled="currentYear === $moment().format('YYYY')"
          @click="dateAdd(1, 'year')"
        >
          ▶
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: this.$moment().format('YYYYMMDD'),
    };
  },
  computed: {
    currentMonth() {
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
      padding: 0.3rem 0.75rem 0.525rem;
    }
  }
</style>
