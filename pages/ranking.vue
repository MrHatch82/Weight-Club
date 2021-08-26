<template>
  <div class="page-ranking container text-center pt-5">
    <h1>RANKING</h1>
    <ul>
      <li v-for="(rank, index) in ranks" :key="index">
        {{ index }} lost {{ rank > 0 ? rank : 0 }} kg.
      </li>
    </ul>
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
            tension: 0.2
          },
          {
            label: 'Paul',
            data: [122, 123, 123, null, 122, 121],
            borderColor: 'rgb(255, 255, 0)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          },
          {
            label: 'Mary',
            data: [112, 112, null, 112, 113, 113],
            borderColor: 'rgb(0, 255, 255)',
            fill: false,
            spanGaps: true,
            tension: 0.2
          }
        ]
      },
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }
  },
  computed: {
    ranks() {
      const ranks = {}

      this.chart.datasets.forEach((dataset) => {
        let lastWeight = null
        let difference = 0

        dataset.data.forEach((weight, index) => {
          if (weight !== null && index > 0) {
            difference += lastWeight - weight
          }
          lastWeight = weight || lastWeight
        })

        ranks[dataset.label] = difference
      })

      return ranks
    }
  }
}
</script>

<style lang='scss'>
.page-ranking {
  ul {
    list-style: decimal;
  }
}
</style>
