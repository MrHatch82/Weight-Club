<template>
  <div class="page page-ranking container">
    <date-picker ref="datePicker" @dateChanged="dateChanged" />

    <transition name="fade">
      <div v-if="!$fetchState.pending" key="content" class="row">
        <div v-if="friends.length">
          <div v-for="(friend, index) in friends" :key="friend.displayName" class="col-12">
            <div class="status-card">
              <div class="row">
                <div class="col-12">
                  <div class="blurp tt-none text-tertiary bigger bg-transparent p-0 text-left bg-transparent mb-2 d-flex justify-content-between">
                    <div class="tt-none">
                      <span class="text-primary">
                        {{ index + 1 }}.
                      </span>
                      {{ displayNames[friend.userId] }}
                    </div>
                    <div ref="points" class="points text-secondary" @mousemove="triggerTooltip($event, index)" @mouseleave="triggerTooltip(null)">
                      {{ friend.points }} Pts.
                    </div>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="blurp shadow-down text-center">
                    <div class="big text-secondary">
                      {{ $displayWeight(friend.weightLossTotal, $store) }}
                    </div>
                    total weight loss
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="blurp shadow-down text-center">
                    <div class="big text-secondary">
                      {{ $displayWeight(friend.weightLossMonth, $store) }}
                    </div>
                    lost this month
                  </div>
                </div>

                <div class="col-6 col-lg-3">
                  <div class="blurp shadow-down text-center">
                    <div class="big text-secondary">
                      {{ $displayWeight(friend.weightRemaining, $store) }}
                    </div>
                    still remaining
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="blurp shadow-down text-center">
                    <div class="big text-secondary">
                      {{ $round(friend.weightLossPercent) }} %
                    </div>
                    of goal reached
                  </div>
                </div>
              </div>
              <status-bar class="mb-3" :percent="friend.weightLossPercent" :month-percent="getMonthPercent(friend)" />
              <activity-calendar :month="friend.exercises" />
            </div>
          </div>
        </div>
        <div v-else class="col-12">
          <h1>Sorry, no data found for this month.</h1>
        </div>
      </div>
      <div v-else key="spinner" class="spinner"></div>
    </transition>
    <tooltip ref="tooltip" :tooltip="tooltip" class="text-right text-secondary" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      friends: [],
      tooltip: 'POINTS!',
      date: this.$dateTime.now().startOf('month').toFormat('yyyyMMdd'),
    };
  },
  async fetch() {
    const Status = this.$parse.Object.extend('Status');
    const query = new this.$parse.Query(Status);
    query.greaterThanOrEqualTo('date', parseInt(this.$dateTime.fromISO(this.date).startOf('month').toFormat('yyyyMMdd')), 10);
    query.lessThanOrEqualTo('date', parseInt(this.$dateTime.fromISO(this.date).endOf('month').toFormat('yyyyMMdd')), 10);

    query.descending('weightLossMonth');
    try {
      const results = await query.find();
      const friends = [];

      for (const object of results) {
        const lastUpdate = parseInt((object.get('date') / 100).toFixed());
        const firstOfMonth = parseInt(this.$dateTime.now().toFormat('yyyyMM'), 10);
        const statusValid = lastUpdate === firstOfMonth;

        const weightLossMonth = statusValid ? object.get('weightLossMonth') : 0;
        const exercisesLight = statusValid ? object.get('exercisesLight') : [];
        const exercisesHeavy = statusValid ? object.get('exercisesHeavy') : [];

        friends.push({
          statusValid,
          userId: object.get('userId'),
          weightLossTotal: object.get('weightLossTotal'),
          weightLossMonth,
          weightLossPercent: object.get('weightLossPercent'),
          weightRemaining: object.get('weightRemaining'),
          exercisesLight,
          exercisesHeavy,
          exercises: statusValid ? object.get('exercises') : [],
          points: this.getPoints({
            weightLossMonth,
            exercisesLight,
            exercisesHeavy,
          }),
        });
      }

      this.friends = friends.sort((a, b) => (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0));
    } catch (error) {
      console.error('Error while fetching Weights', error); // eslint-disable-line
    }
  },
  computed: {
    displayNames() {
      return this.$store.state.displayNames;
    },
  },
  methods: {
    dateChanged(date) {
      this.date = `${date.slice(0, 6)}01`;
      this.$fetch();
    },
    getMonthPercent(friend) {
      return 100 / friend.weightLossTotal * friend.weightLossMonth;
    },
    getPoints(friend) {
      let points = 0;
      points += Math.round(friend.weightLossMonth * 100);
      points += (friend.exercisesLight || 0) * 20;
      points += (friend.exercisesHeavy || 0) * 50;
      return points;
    },
    triggerTooltip(e, friendIndex) {
      if (e) {
        const friend = this.friends[friendIndex];
        this.tooltip = friend.points ? '' : '<span class="text-white">There\'s No point</span>';

        if (friend.weightLossMonth && friend.statusValid) {
          const sum = this.$round(friend.weightLossMonth * 100);
          this.tooltip += `<span class="text-tertiary">${this.$displayWeight(friend.weightLossMonth, this.$store)} lost x ${this.$store.state.weightUnit === 'kg' ? '100' : '45.45'}</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.<br>`;
        }

        if (friend.exercisesHeavy && friend.statusValid) {
          const sum = friend.exercisesHeavy * 50;
          this.tooltip += `<span class="text-tertiary">${friend.exercisesHeavy} Heavy exercise${friend.exercisesintense > 1 ? 's' : ''} x 50</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.<br>`;
        }
        if (friend.exercisesLight && friend.statusValid) {
          const sum = friend.exercisesLight * 20;
          this.tooltip += `<span class="text-tertiary">${friend.exercisesLight} Light exercise${friend.exercisesLight > 1 ? 's' : ''} x 20</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.<br>`;
        }
        if (friend.points && friend.statusValid) {
          this.tooltip += `<br><span class="text-primary">Total</span>&nbsp;&nbsp;&nbsp;${friend.points < 100 ? '&nbsp;&nbsp;' : ''}${friend.points} Pts.`;
        }
      }
      if (this.$refs && this.$refs.tooltip) {
        this.$refs.tooltip.trigger(e);
      }
    },
  },
};
</script>

<style lang='scss'>
.page-ranking {

  .status-card {
    margin-bottom: 2rem;
  }

  .tt-none {
    text-transform: none;
  }

  .points {
    cursor: default;
  }
}
</style>
