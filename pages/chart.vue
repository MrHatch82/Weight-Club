<template>
  <div class="container text-center pt-5">
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
