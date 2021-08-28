<template>
  <div class="page container text-center">
    <div class="chart-wrapper mb-5">
      <client-only>
        <chart-line
          class="chart"
          :data="chart"
          :options="options"
          :width="800"
          :height="500"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: {
        labels: [],
        datasets: [
          {
            label: 'Weight',
            data: [112, 112, null, 112, 113, 113],
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
      return new Array(this.$moment().daysInMonth()).fill(null).map((x, i) => this.$moment().startOf('month').add(i, 'days').format('DD.MM.'));
    },
  },
  mounted() {
    this.chart.labels = this.daysInMonth;
  },
  methods: {
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

        console.log(weights);
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
