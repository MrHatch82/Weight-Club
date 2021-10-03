<template>
  <div class="page page-weight-tracking container">
    <date-picker @dateChanged="dateChanged">
      <div class="col-lg-4 offset-lg-2 mb-4">
        <button class="w-100 btn btn-primary shadow-up" @click="showPopup">
          Add/edit weight
        </button>
      </div>
    </date-picker>

    <div class="chart-wrapper mb-4" :class="{ loaded: !loading }">
      <client-only>
        <transition name="fade">
          <div v-if="!loading" key="chart">
            <chart-line
              ref="chart"
              class="chart"
              :data="chart"
              :options="options"
              :width="1110"
              :height="475"
            />
          </div>
          <div v-else key="spinner" class="spinner" />
        </transition>
      </client-only>
    </div>

    <div class="row">
      <div v-for="fact in facts" :key="fact.text" class="col-6 col-lg-3">
        <div class="blurp shadow-down">
          <div class="big text-secondary">
            {{ fact.variable }}
          </div> {{ fact.text }}
        </div>
      </div>
      <div class="col-12">
        <status-bar :percent="weightLossPercent !== '-' ? weightLossPercent : 0" :month-percent="monthPercent" />
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
            },
            ticks: {
              suggestedMin: 90,
              suggestedMax: 140,
              fontFamily: 'Oswald, sans-serif',
              fontSize: 13,
            },
          }],
          xAxes: [{
            ticks: {
              fontFamily: 'Oswald, sans-serif',
              fontSize: 13,
            },
          }],
        },
        tooltips: {
          intersect: false,
          callbacks: {},
          displayColors: false,
          titleFontColor: '#FFFF00',
          titleFontFamily: 'Oswald, sans-serif',
          titleFontSize: 17,
          bodyFontColor: '#FF00FF',
          bodyFontFamily: 'Oswald, sans-serif',
          bodyFontSize: 13,
          footerFontColor: '#00FFFF',
          footerFontFamily: 'Oswald, sans-serif',
          footerFontSize: 15,
          xPadding: 10,
          yPadding: 10,
          mode: 'index',
        },
        hover: {
          animationDuration: 0,
        },
      },
      weights: null,
      maxWeigt: null,
      minWeight: null,
      firstWeight: null,
      lastWeight: null,
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
    weightLossTotal() {
      if (!this.lastWeight || this.loading) {
        return '-';
      }
      return this.$displayWeight(this.$store.state.weightStart, this.$store) - this.lastWeight;
    },
    weightLossMonth() {
      if (!this.firstWeight || !this.lastWeight || this.loading) {
        return '-';
      }
      return this.firstWeight - this.lastWeight;
    },
    weightLossRemaining() {
      if (!this.lastWeight || this.loading) {
        return '-';
      }
      return this.lastWeight - this.$displayWeight(this.$store.state.weightGoal, this.$store);
    },
    weightLossPercent() {
      if (this.weightLossTotal === '-' || this.loading) {
        return '-';
      }
      const range = this.$displayWeight(this.$store.state.weightStart - this.$store.state.weightGoal, this.$store);

      return (100 / range * this.weightLossTotal);
    },
    monthPercent() {
      if (this.weightLossTotal === '-') {
        return 0;
      }
      return 100 / this.weightLossTotal * this.weightLossMonth;
    },
    facts() {
      return [
        {
          variable: `${this.$round(this.weightLossTotal) || '-'} ${this.$store.state.weightUnit}`,
          text: 'total weight loss',
        },
        {
          variable: `${this.$round(this.weightLossMonth) || '-'} ${this.$store.state.weightUnit}`,
          text: 'lost this month',
        },
        {
          variable: `${this.$round(this.weightLossRemaining) || '-'} ${this.$store.state.weightUnit}`,
          text: 'still remaining',
        },
        {
          variable: `${this.$round(this.weightLossPercent) || '-'} %`,
          text: 'of goal reached',
        },
      ];
    },
  },
  mounted() {
    this.chart.labels = this.daysInMonth;

    this.getWeights();
  },
  methods: {
    createOptionsCallbacks() {
      const year = this.$moment(this.selectedDate).format('YY');
      const unit = this.$store.state.weightUnit;
      const $round = this.$round;
      const weights = this.weights;

      this.options.tooltips.callbacks = {
        title(tooltipItem, data) {
          let label = $round(tooltipItem[0].yLabel);
          label += ` ${unit}`;
          return label;
        },
        label(tooltipItem, data) {
          let title = tooltipItem.label;
          title += year;
          return title;
        },
        footer(tooltipItem, data) {
          const note = weights[tooltipItem[0].index].note;

          if (!note) {
            return;
          }

          return note.split('. ').join('.$pl1t').split('! ').join('!$pl1t').split('? ').join('?$pl1t').split('$pl1t');
        },
      };
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
    dateChanged(newDate) {
      this.selectedDate = newDate;
      this.createLabels();
      this.getWeights();
    },
    populateData(weights) {
      const data = [];
      const weightsOrdered = [];
      let maxWeight = 0;
      let minWeight = 1000;
      let firstWeight = null;
      let lastWeight = null;

      this.daysInMonth.forEach((day) => {
        let kg = null;
        let objectId = null;
        let note = null;

        weights.forEach((weight) => {
          if (this.$moment(day).format('YYYYMMDD') === `${weight.date}`) {
            kg = weight.weight;
            objectId = weight.objectId;
            note = weight.note;

            if (weight.weight > maxWeight) {
              maxWeight = weight.weight;
            }

            if (weight.weight < minWeight) {
              minWeight = weight.weight;
            }

            lastWeight = weight.weight;

            if (!firstWeight) {
              firstWeight = weight.weight;
            }
          }
        });
        data.push(kg);

        weightsOrdered.push({
          weight: kg,
          note,
          objectId,
        });

        this.lastWeight = lastWeight;
        this.firstWeight = firstWeight;
      });

      this.maxWeigt = maxWeight;
      this.minWeight = minWeight;

      const paddingBot = this.$store.state.weightUnit === 'kg' ? 5 : 0.8;
      const paddingTop = this.$store.state.weightUnit === 'kg' ? 1 : 0.16;

      this.options.scales.yAxes[0].ticks.suggestedMin = minWeight - paddingBot;
      this.options.scales.yAxes[0].ticks.suggestedMax = maxWeight + paddingTop;

      this.chart.datasets[0].data = data;
      this.weights = weightsOrdered;

      this.createOptionsCallbacks();
      this.createLabels();

      if (this.$refs && this.$refs.chart) {
        this.$refs.chart.update();
      }
    },
    async getWeights() {
      this.loading = true;

      const Weights = this.$parse.Object.extend('Weights');
      const query = new this.$parse.Query(Weights);
      query.equalTo('userID', this.$store.state.loggedInUserId);
      query.greaterThanOrEqualTo('date', parseInt(this.$moment(this.selectedDate).startOf('month').format('YYYYMMDD')), 10);
      query.lessThanOrEqualTo('date', parseInt(this.$moment(this.selectedDate).endOf('month').format('YYYYMMDD')), 10);
      query.ascending('date');

      try {
        const results = await query.find();

        const weights = [];

        for (const object of results) {
          const userID = object.get('userID');
          const date = object.get('date');
          const weight = object.get('weight');
          const note = object.get('note');

          weights.push({
            userID,
            date,
            weight: this.$displayWeight(weight, this.$store),
            note: note ? this.$he.decode(note) : '',
            objectId: object.id,
          });
        }

        this.populateData(weights);
        this.loading = false;
      } catch (error) {
        console.error('Error while fetching Weights', error); // eslint-disable-line
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
    transition: background 0.2s;
    border-radius: 0.25rem;
  }

  .chart {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
