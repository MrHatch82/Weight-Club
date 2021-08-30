<template>
  <div class="weight-edit-window">
    <div class="date">
      <button class="btn btn-primary btn-sm mr-2" @click="changeDay(-1)">
        ◀
      </button>
      {{ selectedDay }}
      <button class="btn btn-primary btn-sm ml-2" @click="changeDay(1)">
        ▶
      </button>
    </div>
    <b-form-input v-model="newWeight" placeholder="Enter weight" class="mb-4" @keyup="sanitizeWeight"></b-form-input>
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
    };
  },
  computed: {
    selectedDay() {
      if (this.days && this.selectedDayIndex !== null) {
        return this.days[this.selectedDayIndex].format('dddd, DD.MM.');
      }
      return '';
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

      weightObject.set('date', parseInt(this.days[this.selectedDayIndex].format('YYMMDD'), 10));
      weightObject.set('weight', parseFloat(this.newWeight));
      weightObject.set('userID', this.$store.state.loggedInUserId);
      try {
        await weightObject.save();
        this.$parent.$parent.getWeights();
        this.closePopup();
      } catch (error) {
        console.error('Error while saving Weight: ', error);
      }
    },
    sanitizeWeight() {
      if (this.newWeight) {
        this.newWeight.replace(/[^0-9.]/g, '');

        const dotCount = (this.newWeight.match(/\./g) || []).length;

        if (!this.newWeight.endsWith('.') || dotCount > 1) {
          this.newWeight = `${Math.trunc(parseFloat(this.newWeight) * 100) / 100}`;
        }
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
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  input {
    text-align: center;
    font-weight: 600;
  }
}
</style>
