<template>
  <div class="activity-edit-window">
    <b-button-group>
      <button class="btn shadow-up" :class="activityType === 'activityLight' ? 'btn-primary' : 'btn-inactive'" @click="activityType = 'activityLight'">
        light exercise
      </button>
      <button class="btn shadow-up" :class="activityType === 'activityIntense' ? 'btn-primary' : 'btn-inactive'" @click="activityType = 'activityIntense'">
        heavy exercise
      </button>
    </b-button-group>
    <b-form-textarea
      v-model="activityText"
      rows="2"
      max-rows="2"
      placeholder="Describe exercise..."
      class="note mb-4"
      :class="{ 'text-center': !activityText }"
      no-resize
      :formatter="$sanitizeText"
    >
    </b-form-textarea>
    <div class="d-flex justify-content-between">
      <button class="btn btn-primary shadow-up" @click="closePopup">
        Cancel
      </button>
      <button class="btn btn-primary shadow-up" @click="publish">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    days: {
      type: Array,
      default: () => { return []; },
    },
    publishCallback: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      selectedDayIndex: null,
      activityType: 'activityLight',
      activityText: null,
    };
  },
  computed: {
    selectedDay() {
      if (this.days && this.selectedDayIndex !== null && this.days[this.selectedDayIndex]) {
        return this.days[this.selectedDayIndex].date.format('dddd, DD.MM.');
      }
      return '';
    },
    nextButtonDisabled() {
      if (this.selectedDayIndex && this.days[this.selectedDayIndex].date.diff(this.$moment(), 'days') === 0) {
        return true;
      }
      return false;
    },
    prevButtonDisabled() {
      if (this.selectedDayIndex === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.$nuxt.$on('activity-edit-open', this.reset);
  },
  beforeDestroy() {
    this.$nuxt.$off('activity-edit-open');
  },
  methods: {
    changeDay(val) {
      let newDayIndex = this.selectedDayIndex + val;

      if (newDayIndex < 0) {
        newDayIndex = this.days.length - 1;
      }

      if (newDayIndex > this.days.length - 1) {
        newDayIndex = 0;
      }

      this.selectedDayIndex = newDayIndex;
    },
    reset() {
      this.selectedDayIndex = parseInt(this.$moment().format('D'), 10) - 1;
      this.activityText = '';
      this.activityType = 'activityLight';
    },
    closePopup() {
      this.$parent.toggle();
    },
    publish() {
      if (this.activityText) {
        this.$parent.$parent.publishMessage(this.activityText, this.activityType);
      }
    },
  },
};
</script>

<style lang="scss">
.activity-edit-window {

  input {
    text-align: center;
    font-weight: 600;
  }

  .note {
    height: 66px;
    font-weight: 600;
  }

  .btn-group {
    margin-bottom: 1.5rem;
  }

  .btn-inactive {
    background: $darker;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
    inset -1px -1px 0 0 rgba(0, 0, 0, 0.3), inset 1px 0 0 0 rgba(0, 0, 0, 0.3),
    0 4px 8px 0 rgba(0, 0, 0, 0.2) !important;
  }

  .btn-primary {
    background: $primary;
  }

}
</style>
