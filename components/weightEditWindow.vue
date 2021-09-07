<template>
  <div class="weight-edit-window">
    <div class="date">
      <button class="btn btn-primary btn-sm mr-2 btn-arrow" @click="changeDay(-1)">
        ◀
      </button>
      {{ selectedDay }}
      <button class="btn btn-primary btn-sm ml-2 btn-arrow" :disabled="nextButtonDisabled" @click="changeDay(1)">
        ▶
      </button>
    </div>
    <b-form-input v-model="newWeight" placeholder="Enter weight" class="mb-4" :formatter="$sanitizeWeight"></b-form-input>
    <b-form-textarea
      v-model="newNote"
      rows="2"
      max-rows="2"
      placeholder="Enter note (optional)"
      class="note mb-4"
      :class="{ 'text-center': !newNote }"
      no-resize
      :formatter="$sanitizeText"
    >
    </b-form-textarea>
    <div class="d-flex justify-content-between">
      <button class="btn btn-primary" @click="closePopup">
        Cancel
      </button>
      <button class="btn btn-primary" @click="publishWeight">
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
    weights: {
      type: Array,
      default: () => { return []; },
    },
  },
  data() {
    return {
      selectedDayIndex: null,
      newWeight: null,
      newNote: null,
    };
  },
  computed: {
    selectedDay() {
      if (this.days && this.selectedDayIndex !== null && this.days[this.selectedDayIndex]) {
        return this.days[this.selectedDayIndex].format('dddd, DD.MM.');
      }
      return '';
    },
    nextButtonDisabled() {
      if (this.selectedDayIndex && this.days[this.selectedDayIndex].diff(this.$moment(), 'days') === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.$nuxt.$on('weight-edit-open', this.resetWeightEdit);
  },
  beforeDestroy() {
    this.$nuxt.$off('weight-edit-open');
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
      this.newWeight = this.weights[this.selectedDayIndex].weight ? `${this.weights[this.selectedDayIndex].weight}` : '';
      this.newNote = this.weights[this.selectedDayIndex].note ? `${this.weights[this.selectedDayIndex].note}` : null;
    },
    resetWeightEdit() {
      this.selectedDayIndex = parseInt(this.$moment().format('D'), 10) - 1;
      this.newWeight = this.weights[this.selectedDayIndex].weight ? `${this.weights[this.selectedDayIndex].weight}` : '';
    },
    closePopup() {
      this.$parent.toggle();
    },
    async publishWeight() {
      let weightObject = new this.$parse.Object('Weights');

      if (this.weights[this.selectedDayIndex].objectId) {
        const Weights = this.$parse.Object.extend('Weights');
        weightObject = await new this.$parse.Query(Weights).get(this.weights[this.selectedDayIndex].objectId);
      }

      weightObject.set('userID', this.$store.state.loggedInUserId);
      weightObject.set('date', parseInt(this.days[this.selectedDayIndex].format('YYYYMMDD'), 10));
      weightObject.set('weight', parseFloat(this.newWeight));
      weightObject.set('note', this.newNote);
      try {
        await weightObject.save();
        this.$parent.$parent.getWeights();
        this.closePopup();
      } catch (error) {
        console.error('Error while saving Weight: ', error);
      }
    },
  },
};
</script>

<style lang="scss">
.weight-edit-window {
  .date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  input {
    text-align: center;
    font-weight: 600;
  }

  .note {
    height: 66px;
    font-weight: 600;
  }

  .btn-arrow {
    padding: 0.15rem 0.5rem 0.35rem
  }
}
</style>
