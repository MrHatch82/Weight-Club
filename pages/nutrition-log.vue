<template>
  <div class="page page-nutrition-log container">
    <date-picker :day-picker="true" @dateChanged="dateChanged" />
    <div class="row">
      <div class="col-lg-6 d-flex flex-column">
        <h3 class="text-secondary">
          Solids
        </h3>
        <div class="list shadow-down">
          <ul>
            <li v-if="!solids.length">
              No items...
            </li>
            <li v-for="(item, index) in solids" :key="index" class="item" :class="{today: today}" @click="deleteItem('solids', index)">
              <div>{{ item.text }}</div>
              <div v-if="trackKcal && item.kcal">
                {{ item.kcal }} kcal
              </div>
            </li>
          </ul>
          <div v-if="trackKcal">
            <hr>
            <ul>
              <li class="nodash">
                <div>
                  Total
                </div>
                <div>
                  {{ totalKcal }} kcal
                </div>
              </li>
              <li class="nodash">
                <div>
                  Remaining
                </div>
                <div>
                  {{ kcalLimit - totalKcal }} kcal
                </div>
              </li>
            </ul>
          </div>
          <button
            v-if="today"
            class="w-100 btn btn-primary shadow-up"
            @click="showPopup('solids')"
          >
            add item
          </button>
        </div>
      </div>
      <div class="col-lg-6 d-flex flex-column">
        <h3 class="text-tertiary">
          Liquids
        </h3>
        <div class="list shadow-down">
          <ul>
            <li v-if="!liquids.length">
              No items...
            </li>
            <li v-for="(item, index) in liquids" :key="index" class="item" :class="{today: today}" @click="deleteItem('liquids', index)">
              <div>{{ item.text }}</div>
              <div v-if="trackMl && item.ml">
                {{ item.ml }} ml
              </div>
            </li>
          </ul>
          <div v-if="trackMl">
            <hr>
            <ul>
              <li class="nodash">
                <div>
                  Total
                </div>
                <div>
                  {{ totalMl }} ml
                </div>
              </li>
              <li class="nodash">
                <div>
                  Remaining
                </div>
                <div>
                  {{ mlGoal - totalMl }} ml
                </div>
              </li>
            </ul>
          </div>
          <button
            v-if="today"
            class="w-100 btn btn-primary shadow-up"
            @click="showPopup('liquids')"
          >
            add item
          </button>
        </div>
      </div>
    </div>
    <popup ref="popup" :title="popupTitle" emit-id="nutrition-edit-open">
      <nutritionEditWindow ref="editWindow" />
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      solids: [],
      liquids: [],
      date: this.$moment().format('YYYYMMDD'),
      popupTitle: 'Add item',
    };
  },
  computed: {
    trackKcal() {
      return this.$store.state.trackKcal;
    },
    kcalLimit() {
      return this.$store.state.kcalLimit;
    },
    trackMl() {
      return this.$store.state.trackMl;
    },
    mlGoal() {
      return this.$store.state.mlGoal;
    },
    totalKcal() {
      let total = 0;

      this.solids.forEach((item) => {
        total += item.kcal || 0;
      });

      return total;
    },
    totalMl() {
      let total = 0;

      this.liquids.forEach((item) => {
        total += item.ml || 0;
      });

      return total;
    },
    today() {
      return this.$moment(this.date).isSame(this.$moment(), 'day');
    },
  },
  methods: {
    dateChanged(newDate) {
      this.date = newDate;
    },
    showPopup(type) {
      if (this.$refs && this.$refs.popup) {
        this.popupTitle = `Add ${type === 'solids' ? 'solid' : 'liquid'} item`;
        this.$refs.editWindow.setType(type);
        this.$refs.popup.toggle();
      }
    },
    addItem(item) {
      if (item.type === 'solids') {
        this.solids.push(item);
      }
      if (item.type === 'liquids') {
        this.liquids.push(item);
      }
    },
    deleteItem(type, index) {
      if (this.today) {
        this[type].splice(index, 1);
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
    flex-grow: 1;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }

  ul {
    list-style: none;
    padding-left: 1rem;
  }

  li {
    display: flex;
    justify-content: space-between;
    position: relative;

    &.item::before {
      position: absolute;
      left: -1rem;
      top: 0;
      content: '-';
    }

    &.today {
      cursor: pointer;
      &:hover:after {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: $light;
      content: '';
    }
    }
  }

  hr {
    border-top: 1px solid $light;
    width: 100%;
    margin-top: 0;
  }
}
</style>
