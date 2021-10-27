<template>
  <div class="page page-nutrition-log container">
    <date-picker :day-picker="true" @dateChanged="dateChanged" />
    <div class="row">
      <div class="col-lg-9 d-flex flex-column">
        <div class="list shadow-down">
          <ul>
            <li v-if="!items.length">
              No items...
            </li>
            <li v-for="(item, index) in items" :key="index" class="item" :class="{today: today, 'text-tertiary': item.type === 'drink'}" @click="prepareDelete(index)">
              <div>{{ item.text }}</div>
              <div v-if="trackKcal || trackMl" class="d-flex flex-row">
                <div v-if="item.type ==='drink'" class="pl-2 ml">
                  {{ item.ml }} ml
                </div>
                <div class="pl-2 kcal">
                  {{ item.kcal }} kcal
                </div>
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
                <div class="d-flex flex-row">
                  <div class="pl-2 ml">
                    {{ totalMl }} ml
                  </div>
                  <div class="pl-2 kcal">
                    {{ totalKcal }} kcal
                  </div>
                </div>
              </li>
              <li class="nodash">
                <div>
                  Remaining
                </div>
                <div class="d-flex flex-row">
                  <div class="pl-2 ml">
                    {{ mlGoal - totalMl }} ml
                  </div>
                  <div class="pl-2 kcal">
                    {{ kcalLimit - totalKcal }} kcal
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <button
              :disabled="!today"
              class="w-100 btn btn-primary shadow-up"
              @click="showPopup('food')"
            >
              add food item
            </button>
          </div>
          <div class="col-6">
            <button
              :disabled="!today"
              class="w-100 btn btn-primary shadow-up"
              @click="showPopup('drink')"
            >
              add drink item
            </button>
          </div>
        </div>
      </div>
    </div>
    <popup ref="popup" :title="popupTitle" emit-id="nutrition-edit-open">
      <nutritionEditWindow ref="editWindow" />
    </popup>
    <popup ref="delete" title="detlete item?">
      <div class="row">
        <div class="col-6">
          <button
            class="w-100 btn btn-primary shadow-up"
            @click="closeDeletePopup"
          >
            Cancel
          </button>
        </div>
        <div class="col-6">
          <button
            class="w-100 btn btn-primary shadow-up"
            @click="deleteItem"
          >
            delete
          </button>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      objectId: null,
      date: this.$moment().format('YYYYMMDD'),
      popupTitle: 'Add item',
      deleteIndex: null,
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

      this.items.forEach((item) => {
        total += item.kcal || 0;
      });

      return total;
    },
    totalMl() {
      let total = 0;

      this.items.forEach((item) => {
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
        this.popupTitle = `Add ${type} item`;
        this.$refs.editWindow.setType(type);
        this.$refs.popup.toggle();
      }
    },
    closeDeletePopup() {
      this.$refs.delete.close();
    },
    addItem(item) {
      this.items.push(item);
    },
    prepareDelete(index) {
      if (this.today) {
        this.deleteIndex = index;
        this.$refs.delete.toggle();
      }
    },
    deleteItem() {
      if (this.today) {
        this.items.splice(this.deleteIndex, 1);
        this.$refs.delete.close();
      }
    },
  },
};
</script>

<style lang="scss">
.page-nutrition-log {
  .list {
    background: $darker;
    padding: 1rem 2rem 1rem 1rem;
    border-radius: 0.25rem;
    text-align: left;
    flex-grow: 1;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding-left: 1rem;
  }

  li {
    display: flex;
    justify-content: space-between;
    position: relative;
    line-height: 1.6;

    &.item {
      color: $secondary;

      &::before {
        position: absolute;
        left: -1rem;
        top: 0;
        content: '-';
      }
    }

    &.today {
      cursor: pointer;
      &:hover:after {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 2px;
      background: $primary;
      content: '';
    }
    }

    .ml, .kcal {
      min-width: 80px;
      text-align: right;
    }

    .ml {
      color: $tertiary;
    }

    .kcal {
      color: $secondary;
    }
  }

  hr {
    border-top: 1px solid $light;
    width: calc(100% + 1rem);
    margin-top: 0;
  }
}
</style>
