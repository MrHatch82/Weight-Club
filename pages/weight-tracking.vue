<template>
  <div class="page page-weight-tracking container text-center">
    <h1>
      Weight tracking
    </h1>
    <div class="row mb-4 justify-content-center">
      <div class="col-lg-3">
        <div class="datepicker">
          <button class="btn btn-primary btn-sm mr-2 btn-arrow" @click="dateSubtract(1, 'month')">
            ◀
          </button>
          {{ currentMonth }}
          <button class="btn btn-primary btn-sm ml-2 btn-arrow" @click="dateAdd(1, 'month')">
            ▶
          </button>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="datepicker">
          <button class="btn btn-primary btn-sm mr-2 btn-arrow" @click="dateSubtract(1, 'year')">
            ◀
          </button>
          {{ currentYear }}
          <button class="btn btn-primary btn-sm ml-2 btn-arrow" @click="dateAdd(1, 'year')">
            ▶
          </button>
        </div>
      </div>
    </div>

    <div class="chart-wrapper mb-4">
      <client-only>
        <transition name="fade">
          <chart-line
            v-if="!loading"
            ref="chart"
            class="chart"
            :data="chart"
            :options="options"
            :width="1110"
            :height="475"
          />
          <div v-else class="spinner" />
        </transition>
      </client-only>
    </div>

    <div class="row">
      <div v-for="fact in facts" :key="fact.text" class="col-lg-3">
        <div class="blurp">
          <div class="big text-secondary">
            {{ fact.variable }}
          </div> {{ fact.text }}
        </div>
      </div>
    </div>

    <div class="row justify-content-end">
      <div class="col-lg-4">
        <button class="w-100 btn btn-primary" @click="showPopup">
          Add/edit weight
        </button>
      </div>
    </div>

    <popup ref="popup" title="Add/edit weight">
      <weightEditWindow :days="daysInMonth" :weights="weights">
      </weighteditwindow>
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: this.$moment().format('YYYYMMDD'),
      facts: [
        {
          variable: `15 ${this.$store.state.weightFormat}`,
          text: 'total weight loss',
        },
        {
          variable: `15 ${this.$store.state.weightFormat}`,
          text: 'weight loss this month',
        },
        {
          variable: `15 ${this.$store.state.weightFormat}`,
          text: 'to go',
        },
        {
          variable: '15 %',
          text: 'of goal reached',
        },
      ],
      chart: {
        labels: null,
        datasets: [
          {
            label: 'Weight in kg',
            data: null,
            borderColor: 'rgb(0, 255, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(255, 255, 0)',
            pointBorderColor: 'rgb(255, 255, 0)',
            borderWidth: 5,
          },
        ],
      },
      options: {
        legend: false,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: false,
              labelString: 'kg',
            },
            ticks: {
              suggestedMin: 90,
              suggestedMax: 140,
            },
          }],
        },
      },
      weights: null,
      maxWeigt: null,
      minWeight: null,
      loading: true,
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
    dataReady() {
      return this.chart.labels !== null && this.chart.datasets[0].data !== null;
    },
  },
  mounted() {
    this.chart.labels = this.daysInMonth;

    this.createLabels();
    this.getWeights();
  },
  methods: {
    dateAdd(number, unit) {
      this.selectedDate = this.$moment(this.selectedDate).add(number, unit).format('YYYYMMDD');
      this.createLabels();
      this.getWeights();
    },
    dateSubtract(number, unit) {
      this.selectedDate = this.$moment(this.selectedDate).subtract(number, unit).format('YYYYMMDD');
      this.createLabels();
      this.getWeights();
    },
    showPopup() {
      if (this.$refs && this.$refs.popup) {
        this.$refs.popup.toggle();
      }
    },
    createLabels() {
      const labels = [];
      this.daysInMonth.forEach((day) => {
        labels.push(day.format('DD.MM.'));
      });
      this.chart.labels = labels;
    },
    populateData(weights) {
      const data = [];
      const weightsOrdered = [];
      let maxWeight = 0;
      let minWeight = 1000;

      this.daysInMonth.forEach((day) => {
        let kg = null;
        let objectId = null;

        weights.forEach((weight) => {
          if (this.$moment(day).format('YYYYMMDD') === `${weight.date}`) {
            kg = weight.weight;
            objectId = weight.objectId;

            if (weight.weight > maxWeight) {
              maxWeight = weight.weight;
            }

            if (weight.weight < minWeight) {
              minWeight = weight.weight;
            }
          }
        });
        data.push(kg);

        weightsOrdered.push({
          weight: kg,
          objectId,
        });
      });

      this.maxWeigt = maxWeight;
      this.minWeight = minWeight;

      this.options.scales.yAxes[0].ticks.suggestedMin = minWeight - 5;
      this.options.scales.yAxes[0].ticks.suggestedMax = maxWeight + 5;

      this.chart.datasets[0].data = data;
      this.weights = weightsOrdered;

      if (this.$refs && this.$refs.chart) {
        this.$refs.chart.update();
      }
    },
    async getWeights() {
      this.loading = true;

      const Weights = this.$parse.Object.extend('Weights');
      const query = new this.$parse.Query(Weights);
      // You can also query by using a parameter of an object
      query.equalTo('userID', this.$store.state.loggedInUserId);
      query.greaterThanOrEqualTo('date', parseInt(this.$moment(this.selectedDate).startOf('month').format('YYYYMMDD')), 10);
      query.lessThanOrEqualTo('date', parseInt(this.$moment(this.selectedDate).endOf('month').format('YYYYMMDD')), 10);
      // const results = await query.find()
      try {
        const results = await query.find();

        const weights = [];

        for (const object of results) {
          // Access the Parse Object attributes using the .GET method
          const userID = object.get('userID');
          const date = object.get('date');
          const weight = object.get('weight');

          weights.push({
            userID,
            date,
            weight,
            objectId: object.id,
          });
        }

        console.log(weights);

        this.populateData(weights);
        this.loading = false;
      } catch (error) {
        console.error('Error while fetching Weights', error);
      }
    },
  },
};
</script>

<style lang='scss'>
.page-weight-tracking {
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
      height: 38px;
      width: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      padding-bottom: 5px;
    }
  }

  .chart-wrapper {
    padding-bottom: 42.79%;
    width: 100%;
    position: relative;
  }

  .chart {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .blurp {
    padding: 0.375rem 0.75rem;
    border-radius: 0.25rem;
    background: #272727;
    color: $primary;
    font-weight: 600;
    line-height: 1.5;
    text-transform: uppercase;
    margin-bottom: 1rem;
    font-size: 14px;
  }

  .big {
    font-size: 24px;
  }
}
</style>
