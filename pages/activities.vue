<template>
  <div class="page page-activities container">
    <transition name="fade" @before-enter="scrollToBottom">
      <div v-if="loading" key="spinner" class="spinner">
      </div>
      <div v-else key="chat">
        <div class="date-picker-fixed">
          <div class="container">
            <date-picker @dateChanged="dateChanged">
              <div class="col-lg-4 offset-lg-2 mb-4">
                <button class="w-100 btn btn-primary shadow-up" @click="showPopup">
                  add/edit activity
                </button>
              </div>
            </date-picker>
            <div ref="mo" class="month-overview">
              <div
                v-for="(day, index) in daysInMonth"
                :key="index"
                class="day"
              >
                <div class="number" :style="`width: ${dayWidth};`" :class="{ weekend: isWeekend(day.date)}">
                  {{ index + 1 }}
                </div>
                <div class="box" :style="`width: ${dayWidth}; height: ${dayWidth}`" :class="{ weekend: isWeekend(day.date)}">
                  <div v-if="day.activityLight && !day.activityIntense" class="light" />
                  <div v-if="!day.activityLight && day.activityIntense" class="intense" />
                  <div v-if="day.activityLight && day.activityIntense" class="both" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat">
          <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ user: msg.userId === currentUserId }">
            <div v-if="showDayLine(index, msg)" class="day-break">
              <hr>
              <div class="date">
                {{ $moment(msg.createdAt).format('ll') }}
              </div>
            </div>
            <div v-if="showSpeaker(index, msg)" class="speaker">
              {{ displayNames[msg.userId] || msg.userId }}<span class="time">{{ getTime(msg.createdAt) }}</span>
            </div>
            <div class="bubble shadow-down" :class="{ activity: msg.activityLight || msg.activityIntense }">
              <h2 v-if="msg.activityLight">
                Light Exercise
              </h2>
              <h2 v-if="msg.activityIntense" class="text-primary">
                Heavy exercise
              </h2>
              {{ msg.message }}
            </div>
          </div>
        </div>
        <div class="input">
          <div class="container">
            <div class="position-relative">
              <b-form @submit.prevent="submit">
                <b-input v-model="message" class="shadow-down" :placeholder="msgType === 'message' ? 'Enter message...' : 'Describe Activity...'">
                </b-input>
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <popup ref="popup" title="add/edit activity">
      HUI!
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: this.$moment().format('YYYYMM'),
      message: '',
      msgType: 'message',
      loading: true,
      activities: [],
      moWidth: 1140,
    };
  },

  computed: {
    displayNames() {
      return this.$store.state.displayNames;
    },
    currentUserId() {
      return this.$store.state.loggedInUserId;
    },
    messages() {
      return this.$store.state.messages;
    },
    daysInMonth() {
      const monthArray = new Array(
        this.$moment(this.selectedDate).daysInMonth()).fill(null).map((x, i) => {
        let activityLight = false;
        let activityIntense = false;
        const date = this.$moment(this.selectedDate).startOf('month').add(i, 'days');

        this.activities.forEach((activity) => {
          const activityDate = this.$moment(activity.createdAt).format('YYYYMMDD');

          if (activityDate === date.format('YYYYMMDD')) {
            if (activity.activityLight) {
              activityLight = true;
            }
            if (activity.activityIntense) {
              activityIntense = true;
            }
          }
        });

        return {
          date,
          activityLight,
          activityIntense,
        };
      },
      );
      return monthArray;
    },
    dayWidth() {
      return `${this.moWidth / this.daysInMonth.length}px`;
    },
  },
  watch: {
    messages() {
      this.scrollToBottom();
    },
  },
  mounted() {
    this.getMessages();
    this.getMessages(true);
    this.scrollToBottom();

    this.$nextTick(() => {
      this.getMoWidth();

      window.addEventListener('resize', this.getMoWidth);
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('newMessage');
    window.removeEventListener('resize', this.getMoWidth);
  },
  methods: {
    getMoWidth() {
      if (this.$refs) {
        this.moWidth = this.$refs.mo.offsetWidth;
      }
    },
    isWeekend(date) {
      const dayOfWeek = date.day();
      if (dayOfWeek % 6 === 0) {
        return true;
      }
      return false;
    },
    dateChanged(newDate) {
      this.selectedDate = this.$moment(newDate).format('YYYYMM');
      this.getMessages(true);
    },
    showDayLine(index, msg) {
      const prevMsg = index > 0 ? this.messages[index - 1] : {};

      if (Object.keys(prevMsg)) {
        const date = this.$moment(prevMsg.createdAt).format('ll');
        const prevDate = this.$moment(msg.createdAt).format('ll');
        if (prevDate !== date) {
          return true;
        }
      }

      return false;
    },
    showSpeaker(index, msg) {
      const prevMsg = index > 0 ? this.messages[index - 1] : {};

      if (prevMsg.userId !== msg.userId) {
        return true;
      }

      if (prevMsg.createdAt) {
        const momentPrev = this.$moment(prevMsg.createdAt);
        const moment = this.$moment(msg.createdAt);
        const diffMinutes = moment.diff(momentPrev, 'minutes');

        if (diffMinutes >= 5) {
          return true;
        }
      }

      return false;
    },
    getTime(date) {
      return this.$moment(date).format('LT');
    },
    submit() {
      if (this.message.length) {
        this.publishMessage(this.message);
        this.message = '';
      }
    },
    scrollToBottom(waitForTransition = false) {
      if (process.client) {
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, waitForTransition ? 11 : 1);
      }
    },
    async getMessages(activitiesOnly = false) {
      if (!this.$store.state.messages.length || activitiesOnly) {
        const Messages = this.$parse.Object.extend('Messages');
        const query = new this.$parse.Query(Messages);
        const query2 = new this.$parse.Query(Messages);

        if (activitiesOnly) {
          const startOfMonth = this.$moment(`${this.selectedDate}01`).startOf('day').toDate();
          const endOfMonth = this.$moment(`${this.selectedDate}${this.$moment(this.selectedDate).daysInMonth()}`).endOf('day').toDate();
          query.greaterThanOrEqualTo('createdAt', startOfMonth);
          query.lessThanOrEqualTo('createdAt', endOfMonth);
          query.equalTo('activityLight', true);
          query.equalTo('userId', this.$store.state.loggedInUserId);

          query2.greaterThanOrEqualTo('createdAt', startOfMonth);
          query2.lessThanOrEqualTo('createdAt', endOfMonth);
          query2.equalTo('activityIntense', true);
          query2.equalTo('userId', this.$store.state.loggedInUserId);
        } else {
          query.descending('createdAt').limit(100);
        }

        try {
          const results = activitiesOnly ? await this.$parse.Query.or(query, query2).find() : await query.find();

          const messages = [];

          for (const object of results) {
            const userId = object.get('userId');
            const activityLight = object.get('activityLight');
            const activityIntense = object.get('activityIntense');
            const message = object.get('message');
            const createdAt = object.get('createdAt');

            messages.unshift({
              userId,
              activityLight,
              activityIntense,
              message,
              createdAt,
            });
          }

          if (!activitiesOnly) {
            this.$store.commit('setMessages', messages);
          } else {
            this.activities = messages;
          }

          this.loading = false;
        } catch (error) {
        console.error('Error while fetching Messages', error); // eslint-disable-line
        }
      } else {
        this.loading = false;
      }
    },
    async publishMessage(message) {
      const messageObject = new this.$parse.Object('Messages');

      const newMessage = message;
      const activityLight = this.msgType === 'activityLight';
      const activityIntense = this.msgType === 'activityIntense';

      messageObject.set('userId', this.$store.state.loggedInUserId);
      messageObject.set('message', newMessage);
      messageObject.set('activityLight', activityLight);
      messageObject.set('activityIntense', activityIntense);

      this.$store.commit('appendMessages', {
        createdAt: new Date(),
        userId: this.$store.state.loggedInUserId,
        activityLight,
        activityIntense,
        message,
      });

      this.msgType = 'message';

      this.scrollToBottom();

      try {
        await messageObject.save();

        if (activityLight || activityIntense) {
          this.updateStatus();
        }
      } catch (error) {
        console.error('Error while saving message: ', error);
        this.message = message;
      }
    },
    async updateStatus() {
      const state = this.$store.state;
      await this.$parse.Cloud.run('setStatus', {
        userId: state.loggedInUserId,
        userSettings: {
          weightStart: state.weightStart,
          weightGoal: state.weightGoal,
        },
      });
    },
    showPopup() {
      if (this.$refs && this.$refs.popup) {
        this.$refs.popup.toggle();
      }
    },
  },
};
</script>

<style lang="scss">
.page-activities {
  .date-picker-fixed {
    position: fixed;
    top: 72px;
    left: 0;
    width: 100%;
    z-index: 20;
    padding-top: 64px;
    background: $dark;
  }

  .month-overview {
    display: flex;

    .number {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      font-weight: 400;
    }

    .box {
      border: 2px solid $dark;
      background: lighten($medium, 1%);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      border-radius: 0.2rem;

      &.weekend {
        background: darken($medium, 4%);
      }

      .light {
        width: 65%;
        height: 65%;
        background: $tertiary;
        border-radius: 50%;
      }

      .intense {
        width: 65%;
        height: 65%;
        background: $primary;
        border-radius: 50%;
      }

      .both {
        width: 65%;
        height: 65%;
        background: $tertiary;
        border-radius: 50%;
        position: relative;
        overflow: hidden;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 52%;
          background: $primary;
          content: '';
        }
      }
    }
  }

  .chat {
    min-height: calc(100vh - 72px - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding-top: 117px;
    padding-bottom: 78px;

    // clearfix
    &::after {
      content: " ";
      display: block;
      height: 0;
      clear: both;
    }
  }

  .day-break {
    padding: 0.5rem 0;
    float: none;
    clear: both;
    position: relative;
    margin-bottom: -1rem;

    .date {
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -60%);
      color: #6f6f6f;
      background: $dark;
      padding: 0 .5rem;
      line-height: 1;
      font-weight: 300;
      letter-spacing: 0.25px;
      font-size: 12px;
    }
  }

  .speaker {
    display: flex;
    align-items: baseline;
    flex-direction: row;
    margin: 1rem 0 0.25rem;
    padding: 0 1rem;
    float: left;
    clear: both;
    letter-spacing: 1px;
    font-weight: 600;
    color: $primary;
    font-size: 18px;
    vertical-align: baseline;

    .time {
      color: #6f6f6f;
      font-weight: 300;
      letter-spacing: normal;
      font-size: 12px;
      margin: 0 0.25rem 0.1rem;
    }
  }

  .bubble {
    background: $darker;
    border-radius: 10px 10px 10px 3px;
    max-width: 85%;
    color: $light;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    float: left;
    clear: both;
    letter-spacing: 0.5px;
    font-weight: 400;
  }

  .user {
    .speaker {
      color: $secondary;
      float: right;
      flex-direction: row-reverse;
    }

    .bubble {
      border-radius: 10px 10px 3px 10px;
     float: right;
    }
  }

  .input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 2rem;

    input {
      font-weight: 500;
    }
  }

  .activity {
    color: $secondary;

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      text-transform: uppercase;
      color: $tertiary;
      letter-spacing: 1px;
    }
  }

  .btn-inactive {
    background: $darker;
    box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
    inset -1px -1px 0 0 rgba(0, 0, 0, 0.3), inset 1px 0 0 0 rgba(0, 0, 0, 0.3),
    0 4px 8px 0 rgba(0, 0, 0, 0.2) !important;
  }

  .btn-primary {
    background: $primary;
  }

  .btn-group {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
