<template>
  <div class="page container text-center">
    <div class="chart-wrapper mb-5">
      <client-only>
        <chart-line
          v-if="dataReady"
          class="chart"
          :data="chart"
          :options="options"
          :width="800"
          :height="500"
        />
      </client-only>
    </div>
    <button class="btn btn-primary" @click="showPopup">
      Add todays weight
    </button>
    <popup ref="popup" title="Weight options">
      <b-form-input v-model="newWeight" placeholder="Enter weight" class="mb-4"></b-form-input>
      <div class="d-flex justify-content-between">
        <button class="btn btn-primary" @click="showPopup">
          Cancel
        </button>
        <button class="btn btn-primary" @click="showPopup">
          Submit
        </button>
      </div>
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newWeight: null,
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
          },
        ],
      },
      options: {
        legend: false,
      },
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
      this.daysInMonth.forEach((day) => {
        let kg = null;
        weights.forEach((weight) => {
          if (this.$moment(day).format('YYMMDD') === `${weight.date}`) {
            kg = weight.weight;
          }
        });
        data.push(kg);
      });
      this.chart.datasets[0].data = data;
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
