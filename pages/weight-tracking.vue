<template>
  <div class="page page-weight-tracking container text-center">
    <h1>
      Weight tracking
    </h1>
    <div class="row mb-4 justify-content-between">
      <div class="col-lg-4">
        {{ $moment().format('MMMM') }}
      </div>
      <div class="col-lg-4">
        <button class="w-100 btn btn-primary" @click="showPopup">
          Add/edit weight
        </button>
      </div>
    </div>

    <div class="chart-wrapper mb-4">
      <client-only>
        <transition name="fade">
          <chart-line
            v-if="dataReady"
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
      <div class="col-lg-4">
        <div class="blurp">
          <span class="text-secondary">15 kg</span> weight loss this month
        </div>
      </div>
      <div class="col-lg-4">
        <div class="blurp">
          <span class="text-secondary">15 kg</span> total weight loss
        </div>
      </div>
      <div class="col-lg-4">
        <div class="blurp">
          <span class="text-secondary">15 %</span> of goal reached
        </div>
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
    daysInMonth() {
      return new Array(this.$moment().daysInMonth()).fill(null).map((x, i) => this.$moment().startOf('month').add(i, 'days'));
    },
    dataReady() {
      return this.chart.labels !== null && this.chart.datasets[0].data !== null;
    },
  },
  mounted() {
    this.chart.labels = this.daysInMonth;

    this.getWeights();
    this.createLabels();
  },
  methods: {
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
          if (this.$moment(day).format('YYMMDD') === `${weight.date}`) {
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
    background: #262626;
    color: $primary;
    font-weight: 600;
    line-height: 1.5;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }
}
</style>
