<template>
  <div class="page page-exercises container">
    <transition name="fade" @before-enter="scrollToBottom">
      <div v-if="loading" key="spinner" class="spinner">
      </div>
      <div v-else key="chat">
        <div class="date-picker-fixed">
          <div class="container">
            <date-picker @dateChanged="dateChanged">
              <div class="col-lg-4 offset-lg-2 mb-4">
                <button class="w-100 btn btn-primary shadow-up" @click="showPopup">
                  add activity
                </button>
              </div>
            </date-picker>
            <activity-calendar :month="daysInMonth" />
          </div>
          <div class="gradient" />
        </div>
        <div class="chat">
          <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ user: msg.userId === currentUserId }">
            <div v-if="showDayLine(index, msg)" class="day-break">
              <hr>
              <div class="date">
                {{ $dateTime.fromJSDate(msg.createdAt).toFormat('MMM d, yyyy') }}
              </div>
            </div>
            <div v-if="showSpeaker(index, msg)" class="speaker">
              {{ displayNames[msg.userId] || msg.userId }}<span class="time">{{ getTime(msg.createdAt) }}</span>
            </div>
            <div class="bubble shadow-down" :class="{ activity: msg.exerciseLight || msg.exerciseHeavy }">
              <h2 v-if="msg.exerciseLight">
                Light Exercise
              </h2>
              <h2 v-if="msg.exerciseHeavy" class="text-primary">
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
                <b-form-input v-model="message" class="shadow-down" :placeholder="msgType === 'message' ? 'Enter message...' : 'Describe Activity...'" />
              </b-form>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <popup ref="popup" title="add activity" emit-id="activity-edit-open">
      <activityEditWindow :days="daysInMonth" />
    </popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: this.$dateTime.now().toFormat('yyyyMMdd'),
      message: '',
      msgType: 'message',
      loading: true,
      exercises: [],
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
      const first = this.$dateTime.fromISO(this.selectedDate).startOf('month');
      const monthArray = new Array(
        parseInt(this.$dateTime.fromISO(this.selectedDate).endOf('month').toFormat('d'))).fill(null).map((x, i) => {
        let exerciseLight = false;
        let exerciseHeavy = false;
        const date = first.plus({ days: i }).toJSDate();

        this.exercises.forEach((activity) => {
          if (`${activity.date}` === this.$dateTime.fromJSDate(date).toFormat('yyyyMMdd')) {
            if (activity.exerciseLight) {
              exerciseLight = true;
            }
            if (activity.exerciseHeavy) {
              exerciseHeavy = true;
            }
          }
        });

        return {
          date,
          exerciseLight,
          exerciseHeavy,
        };
      },
      );
      return monthArray;
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
  },
  beforeDestroy() {
    this.$nuxt.$off('newMessage');
    window.removeEventListener('resize', this.getMoWidth);
  },
  methods: {
    dateChanged(newDate) {
      this.selectedDate = this.$dateTime.fromISO(newDate).toFormat('yyyyMM');
      this.getMessages(true);
    },
    showDayLine(index, msg) {
      const prevMsg = index > 0 ? this.messages[index - 1] : {};

      if (Object.keys(prevMsg)) {
        const date = this.$dateTime.fromJSDate(prevMsg.createdAt).toFormat('d');
        const prevDate = this.$dateTime.fromJSDate(msg.createdAt).toFormat('d');
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
        const datePrev = this.$dateTime.fromJSDate(prevMsg.createdAt);
        const date = this.$dateTime.fromJSDate(msg.createdAt);
        const diffMinutes = date.diff(datePrev, 'minutes').toFormat('m');

        if (diffMinutes >= 5) {
          return true;
        }
      }

      return false;
    },
    getTime(date) {
      return this.$dateTime.fromJSDate(date).toLocaleString(this.$dateTime.TIME_SIMPLE);
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
    async getMessages(exercisesOnly = false) {
      if (!this.$store.state.messages.length || exercisesOnly) {
        const Messages = this.$parse.Object.extend('Messages');
        const query = new this.$parse.Query(Messages);
        const query2 = new this.$parse.Query(Messages);

        if (exercisesOnly) {
          const startOfMonth = this.$dateTime.fromISO(this.selectedDate).startOf('month').startOf('day').toJSDate();
          const endOfMonth = this.$dateTime.fromISO(this.selectedDate).endOf('month').endOf('day').toJSDate();
          query.greaterThanOrEqualTo('createdAt', startOfMonth);
          query.lessThanOrEqualTo('createdAt', endOfMonth);
          query.equalTo('exerciseLight', true);
          query.equalTo('userId', this.$store.state.loggedInUserId);

          query2.greaterThanOrEqualTo('createdAt', startOfMonth);
          query2.lessThanOrEqualTo('createdAt', endOfMonth);
          query2.equalTo('exerciseHeavy', true);
          query2.equalTo('userId', this.$store.state.loggedInUserId);
        } else {
          query.descending('createdAt').limit(100);
        }

        try {
          const results = exercisesOnly ? await this.$parse.Query.or(query, query2).find() : await query.find();

          const messages = [];

          for (const object of results) {
            messages.unshift({
              userId: object.get('userId'),
              exerciseLight: object.get('exerciseLight'),
              exerciseHeavy: object.get('exerciseHeavy'),
              message: object.get('message'),
              createdAt: object.get('createdAt'),
              date: object.get('date'),
            });
          }

          if (!exercisesOnly) {
            this.$store.commit('setMessages', messages);
          } else {
            this.exercises = messages;
          }

          this.loading = false;
        } catch (error) {
        console.error('Error while fetching Messages', error); // eslint-disable-line
        }
      } else {
        this.loading = false;
      }
    },
    async publishMessage(message, msgType) {
      const messageObject = new this.$parse.Object('Messages');

      const newMessage = message;
      const exerciseLight = msgType === 'exerciseLight';
      const exerciseHeavy = msgType === 'exerciseHeavy';
      const date = parseInt(this.$dateTime.now().toFormat('yyyyMMdd'), 10);

      messageObject.set('userId', this.$store.state.loggedInUserId);
      messageObject.set('message', newMessage);
      messageObject.set('exerciseLight', exerciseLight);
      messageObject.set('exerciseHeavy', exerciseHeavy);
      messageObject.set('date', date);

      this.$store.commit('appendMessages', {
        createdAt: new Date(),
        userId: this.$store.state.loggedInUserId,
        exerciseLight,
        exerciseHeavy,
        message,
        date,
      });

      this.scrollToBottom();

      if (exerciseLight || exerciseHeavy) {
        this.$refs.popup.toggle();
      }

      try {
        await messageObject.save();

        if (exerciseLight || exerciseHeavy) {
          this.updateStatus();
          this.getMessages(true);
        }
      } catch (error) {
        console.error('Error while saving message: ', error); // eslint-disable-line
        this.message = message;
      }
    },
    async updateStatus() {
      const state = this.$store.state;
      await this.$parse.Cloud.run('setStatus', {
        date: parseInt(this.$dateTime.now().toFormat('yyyyMMdd'), 10),
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
.page-exercises {
  .date-picker-fixed {
    position: fixed;
    top: $topnavHeightMobile;
    left: 0;
    width: 100%;
    z-index: 1;
    padding-top: 1rem;
    background: $dark;

    @include media-breakpoint-up(lg) {
      top: $topnavHeight;
      padding-top: 4rem;
    }

    .month-overview {
      margin-top: -1rem;

      @include media-breakpoint-up(lg) {
        margin-top: 0;
      }
    }
  }

  .gradient {
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    height: 4rem;
    width: 100%;
    background: linear-gradient(0deg, rgba(51,51,51,0) 0%, rgba(51,51,51,1) 80%);
    z-index: 1;
  }

  .chat {
    min-height: calc(100vh - 72px - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-top: 149px;
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
    padding-bottom: 1.5rem;

    @include media-breakpoint-up(lg) {
      padding-bottom: 2rem;
    }

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
}
</style>
