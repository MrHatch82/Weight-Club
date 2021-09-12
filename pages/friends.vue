<template>
  <div class="page page-ranking container">
    <transition name="fade">
      <div v-if="friends.length" key="content" class="row">
        <div v-for="(friend, index) in friends" :key="friend.displayName" class="col-12">
          <div class="status-card">
            <div class="row">
              <div class="col-12">
                <div class="blurp text-tertiary bigger bg-transparent pl-0 text-left bg-transparent mb-1">
                  <span class="text-primary">
                    {{ index + 1 }}.
                  </span>
                  {{ friend.displayName }}
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $displayWeight(friend.weightLossTotal, $store) }} {{ $store.state.weightUnit }}
                  </div>
                  total weight loss
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $displayWeight(friend.weightLossMonth, $store) }} {{ $store.state.weightUnit }}
                  </div>
                  lost this month
                </div>
              </div>

              <div class="col-md-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $displayWeight(friend.weightRemaining, $store) }} {{ $store.state.weightUnit }}
                  </div>
                  still remaining
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="blurp shadow-down text-center">
                  <div class="big text-secondary">
                    {{ $round(friend.weightLossPercent) }} %
                  </div>
                  of goal reached
                </div>
              </div>
            </div>
            <status-bar :percent="friend.weightLossPercent" :month-percent="getMonthPercent(friend)" />
          </div>
        </div>
      </div>
      <div v-else key="spinner" class="spinner"></div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      friends: [],
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
        friends.push({
          displayName: object.get('displayName'),
          weightLossTotal: object.get('weightLossTotal'),
          weightLossMonth: object.get('weightLossMonth'),
          weightLossPercent: object.get('weightLossPercent'),
          weightRemaining: object.get('weightRemaining'),
        });
      }

      this.friends = friends;
    } catch (error) {
      console.error('Error while fetching Weights', error);
    }
  },
  methods: {
    getMonthPercent(friend) {
      return 100 / friend.weightLossTotal * friend.weightLossMonth;
    },
  },
};
</script>

<style lang='scss'>
.page-ranking {
  .status-card {
    margin-bottom: 2rem;
  }
}
</style>
