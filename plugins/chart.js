import Vue from 'vue'
import { Line } from 'vue-chartjs'

Vue.component('ChartLine', {
  extends: Line,
  props: { data: Object, options: Object }, // eslint-disable-line
  mounted() {
    this.renderChart(this.data, this.options)
  }
})
