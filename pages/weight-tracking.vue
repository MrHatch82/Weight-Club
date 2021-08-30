<template>
  <div class="page container text-center">
    <h1>Weight tracking</h1>
    <div class="chart-wrapper mb-5">
      <client-only>
        <chart-line
          v-if="dataReady"
          ref="chart"
          class="chart"
          :data="chart"
          :options="options"
          :width="800"
          :height="500"
        />
      </client-only>
    </div>
    <button class="btn btn-primary" @click="showPopup">
      Add/edit weight
    </button>
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
            label: 'Weight',
            data: null,
            borderColor: 'rgb(0, 255, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(255, 255, 0)',
            pointBorderColor: 'rgb(255, 255, 0)',
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

      this.daysInMonth.forEach((day) => {
        let kg = null;
        let objectId = null;

        weights.forEach((weight) => {
          if (this.$moment(day).format('YYMMDD') === `${weight.date}`) {
            kg = weight.weight;
            objectId = weight.objectId;
          }
        });
        data.push(kg);

        weightsOrdered.push({
          weight: kg,
          objectId,
        });
      });

      this.chart.datasets[0].data = data;
      this.weights = weightsOrdered;

      if (this.$refs && this.$refs.chart) {
        this.$refs.chart.update();
      }
    },
    async getWeights() {
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
      } catch (error) {
        console.error('Error while fetching Weights', error);
      }
    },
  },
};
</script>

<style lang='scss'>
.chart-wrapper {
  padding-bottom: 62.5%;
  width: 100%;
  position: relative;
}

.chart {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
