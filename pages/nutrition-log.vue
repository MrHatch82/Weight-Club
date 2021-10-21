<template>
  <div class="page page-nutrition-log container">
    <date-picker :day-picker="true" @dateChanged="dateChanged">
      <div class="col-6 col-lg-3 mb-4">
        <button class="w-100 btn btn-primary shadow-up" @click="showPopup">
          add item
        </button>
      </div>
    </date-picker>
    <div class="row">
      <div class="col-lg-6">
        <h3 class="text-secondary">
          Solids
        </h3>
        <div class="list shadow-down">
          <ul>
            <li v-if="!solids.length">
              No items...
            </li>
          </ul>
        </div>
      </div>
      <div class="col-lg-6">
        <h3 class="text-tertiary">
          Liquids
        </h3>
        <div class="list shadow-down">
          <ul>
            <li v-if="!liquids.length">
              No items...
            </li>
          </ul>
        </div>
      </div>
    </div>
    <popup ref="popup" title="add item" emit-id="nutrition-edit-open">
      <nutritionEditWindow />
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      solids: [],
      liquids: [],
    };
  },
  methods: {
    dateChanged(newDate) {
      console.log(newDate);
    },
    showPopup() {
      if (this.$refs && this.$refs.popup) {
        this.$refs.popup.toggle();
      }
    },
  },
};
</script>

<style lang="scss">
.page-nutrition-log {
  .list {
    background: $darker;
    padding: 1rem;
    border-radius: 0.25rem;
    text-align: left;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }
}
</style>
