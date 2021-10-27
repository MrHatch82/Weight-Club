<template>
  <div class="nutrition-edit-window">
    <b-form @submit.prevent="publish">
      <b-form-input
        ref="input"
        v-model="itemText"
        :placeholder="`What you ${nutritionType === 'food' ? 'ate' : 'drank'}*`"
        class="mb-4"
        :formatter="$sanitizeText"
      />
      <b-form-input
        v-if="trackMl && nutritionType === 'drink'"
        v-model="ml"
        placeholder="ml (Pint = 568 ml)"
        class="mb-4"
        :formatter="$sanitizeWeight"
      />
      <b-form-input
        v-if="trackKcal"
        v-model="kcal"
        placeholder="kcal"
        class="mb-4"
        :formatter="$sanitizeWeight"
      />
      <div class="d-flex justify-content-between">
        <button class="btn btn-primary shadow-up" @click="closePopup">
          Cancel
        </button>
        <button class="btn btn-primary shadow-up" type="submit">
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
      nutritionType: 'food',
      itemText: null,
      kcal: '',
      ml: '',
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
    trackKcal() {
      return this.$store.state.trackKcal;
    },
    trackMl() {
      return this.$store.state.trackMl;
    },
  },
  mounted() {
    this.$nuxt.$on('nutrition-edit-open', this.reset);
  },
  beforeDestroy() {
    this.$nuxt.$off('nutrition-edit-open');
  },
  methods: {
    reset() {
      this.itemText = '';
      this.kcal = '';
      this.ml = '';
      this.$refs.input.focus();
    },
    closePopup() {
      this.$parent.close();
    },
    setType(type) {
      this.nutritionType = type;
    },
    publish() {
      if (this.itemText) {
        const item = {
          type: this.nutritionType,
          text: this.itemText,
          kcal: parseInt(this.kcal, 10) || 0,
        };

        if (this.nutritionType === 'drink') {
          item.ml = parseInt(this.ml, 10) || 0;
        }

        this.$parent.$parent.addItem(item);
        this.closePopup();
      }
    },
  },
};
</script>

<style lang="scss">
.nutrition-edit-window {

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
