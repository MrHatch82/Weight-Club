<template>
  <div class="page page-ranking container">
    <transition name="fade">
      <div v-if="friends.length" key="content" class="row">
        <div v-for="(friend, index) in friends" :key="friend.displayName" class="col-12">
          <div class="status-card">
            <div class="row">
              <div class="col-12">
                <div class="blurp tt-none text-tertiary bigger bg-transparent px-0 text-left bg-transparent mb-1 d-flex justify-content-between">
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
                    {{ $displayWeight(friend.weightLossTotal, $store) }} {{ $store.state.weightUnit }}
                  </div>
                  total weight loss
                </div>
              </div>
              <div class="col-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $displayWeight(friend.weightLossMonth, $store) }} {{ $store.state.weightUnit }}
                  </div>
                  lost this month
                </div>
              </div>

              <div class="col-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $displayWeight(friend.weightRemaining, $store) }} {{ $store.state.weightUnit }}
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
            <activity-calendar :month="friend.activities" />
          </div>
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
    };
  },
  async fetch() {
    const Status = this.$parse.Object.extend('Status');
    const query = new this.$parse.Query(Status);
    query.descending('weightLossMonth');
    try {
      const results = await query.find();
      const friends = [];

      for (const object of results) {
        const lastUpdate = parseInt(this.$moment(object.get('updatedAt')).format('YYYYMM'), 10);
        const firstOfMonth = parseInt(this.$moment().format('YYYYMM'), 10);
        const statusValid = lastUpdate === firstOfMonth;

        const weightLossMonth = statusValid ? object.get('weightLossMonth') : 0;
        const activitiesLight = object.get('activitiesLight');
        const activitiesIntense = object.get('activitiesIntense');

        friends.push({
          userId: object.get('userId'),
          weightLossTotal: object.get('weightLossTotal'),
          weightLossMonth,
          weightLossPercent: object.get('weightLossPercent'),
          weightRemaining: object.get('weightRemaining'),
          activitiesLight,
          activitiesIntense,
          activities: statusValid ? object.get('activities') : [],
          points: this.getPoints({
            weightLossMonth,
            activitiesLight,
            activitiesIntense,
          }),
        });
      }

      this.friends = friends.sort((a, b) => (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0));
    } catch (error) {
      console.error('Error while fetching Weights', error);
    }
  },
  computed: {
    displayNames() {
      return this.$store.state.displayNames;
    },
  },
  methods: {
    getMonthPercent(friend) {
      return 100 / friend.weightLossTotal * friend.weightLossMonth;
    },
    getPoints(friend) {
      let points = 0;
      points += Math.round(friend.weightLossMonth * 100);
      points += (friend.activitiesLight || 0) * 20;
      points += (friend.activitiesIntense || 0) * 50;
      return points;
    },
    triggerTooltip(e, friendIndex) {
      if (e) {
        const friend = this.friends[friendIndex];
        this.tooltip = friend.points ? '' : '<span class="text-white">There\'s No point</span>';

        if (friend.weightLossMonth) {
          const sum = friend.weightLossMonth * 100;
          this.tooltip += `<span class="text-tertiary">${friend.weightLossMonth} kilo${friend.weightLossMonth > 1 ? 's' : ''} lost x 100</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.`;
        }

        if (friend.activitiesIntense) {
          const sum = friend.activitiesIntense * 50;
          this.tooltip += `<br><span class="text-tertiary">${friend.activitiesIntense} Heavy exercise${friend.activitiesintense > 1 ? 's' : ''} x 50</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.`;
        }
        if (friend.activitiesLight) {
          const sum = friend.activitiesLight * 20;
          this.tooltip += `<br><span class="text-tertiary">${friend.activitiesLight} Light exercise${friend.activitiesLight > 1 ? 's' : ''} x 20</span>&nbsp;&nbsp;&nbsp;${sum < 100 ? '&nbsp;&nbsp;' : ''}${sum} Pts.`;
        }
        if (friend.points) {
          this.tooltip += `<br><br><span class="text-primary">Total</span>&nbsp;&nbsp;&nbsp;${friend.points < 100 ? '&nbsp;&nbsp;' : ''}${friend.points} Pts.`;
        }
      }
      this.$refs.tooltip.trigger(e);
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
