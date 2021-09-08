<template>
  <div class="page page-ranking container text-center">
    <ul>
      <li v-for="(rank, index) in ranks" :key="index">
        {{ index }} lost {{ rank > 0 ? rank : 0 }} kg.
      </li>
    </ul>
    <div>
      <p>
        <span class="fat">{{ total }} kg</span><br />
        of fat collectively<br />
        eradicated this month!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chart: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: [
          {
            label: 'Peter',
            data: [130, 129, 129, 128, 127, null],
            borderColor: 'rgb(255, 0, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2,
          },
          {
            label: 'Paul',
            data: [122, 123, 123, null, 122, 121],
            borderColor: 'rgb(255, 255, 0)',
            fill: false,
            spanGaps: true,
            tension: 0.2,
          },
          {
            label: 'Mary',
            data: [112, 112, null, 112, 113, 113],
            borderColor: 'rgb(0, 255, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2,
          },
        ],
      },
      options: {
        legend: {
          position: 'bottom',
        },
      },
    };
  },
  computed: {
    ranks() {
      const ranks = {};

      this.chart.datasets.forEach((dataset) => {
        let lastWeight = null;
        let difference = 0;

        dataset.data.forEach((weight, index) => {
          if (weight !== null && index > 0) {
            difference += lastWeight - weight;
          }
          lastWeight = weight || lastWeight;
        });

        ranks[dataset.label] = difference;
      });

      return ranks;
    },
    total() {
      let total = 0;

      this.chart.datasets.forEach((dataset) => {
        let lastWeight = null;
        let difference = 0;

        dataset.data.forEach((weight, index) => {
          if (weight !== null && index > 0) {
            difference += lastWeight - weight;
          }
          lastWeight = weight || lastWeight;
        });

        total += difference;
      });

      return total;
    },
  },
  mounted() {
    this.getWeights();
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
      } catch (error) {
        console.error('Error while fetching Weights', error);
      }
    },
  },
};
</script>

<style lang='scss'>
.page-ranking {
  ul {
    list-style: decimal;
  }
}
</style>
