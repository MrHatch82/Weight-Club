<template>
  <div class="activity-edit-window">
    <b-form @submit.prevent="publish">
      <b-button-group>
        <button class="btn shadow-up" :class="activityType === 'exerciseLight' ? 'btn-primary' : 'btn-inactive'" @click="activityType = 'exerciseLight'">
          light exercise
        </button>
        <button class="btn shadow-up" :class="activityType === 'exerciseHeavy' ? 'btn-primary' : 'btn-inactive'" @click="activityType = 'exerciseHeavy'">
          heavy exercise
        </button>
      </b-button-group>
      <b-form-textarea
        ref="input"
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
        <button type="button" class="btn btn-primary shadow-up" @click="closePopup">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary shadow-up">
          Submit
        </button>
      </div>
    </b-form>
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
      activityType: 'exerciseLight',
      activityText: null,
    };
  },
  computed: {
    selectedDay() {
      if (this.days && this.selectedDayIndex !== null && this.days[this.selectedDayIndex]) {
        return this.days[this.selectedDayIndex].date.toFormat('cccc, dd.MM.');
      }
      return '';
    },
    nextButtonDisabled() {
      if (this.selectedDayIndex && this.days[this.selectedDayIndex].date.diff(this.$dateTime.now(), 'days') === 0) {
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

    this.$nextTick(() => {
      this.$refs.input.$el.addEventListener('keypress', this.keyHandler);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('activity-edit-open');
    this.$refs.input.$el.removeEventListener('keypress', this.keyHandler);
  },
  methods: {
    keyHandler(event) {
      if (event.which === 13) {
        event.target.form.dispatchEvent(new Event('submit', { cancelable: true }));
        event.preventDefault();
      }
    },
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
      this.selectedDayIndex = this.$dateTime.now().day - 1;
      this.activityText = '';
      this.activityType = 'exerciseLight';
      this.$refs.input.focus();
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
    width: 100%;
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
