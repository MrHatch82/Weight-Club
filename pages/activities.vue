<template>
  <div class="page page-activities container">
    <transition name="fade" @before-enter="scrollToBottom">
      <div v-if="loading" key="spinner" class="spinner">
      </div>
      <div v-else key="chat">
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
              <b-button-group size="sm" class="btn-group">
                <button class="btn shadow-up" :class="msgType === 'message' ? 'btn-primary' : 'btn-inactive'" @click="msgType = 'message'">
                  Message
                </button>
                <button class="btn shadow-up" :class="msgType === 'activityLight' ? 'btn-primary' : 'btn-inactive'" @click="msgType = 'activityLight'">
                  Light exercise
                </button>
                <button
                  class="btn shadow-up"
                  :class="msgType === 'activityIntense' ? 'btn-primary' : 'btn-inactive'"
                  @click="msgType = 'activityIntense'"
                >
                  Heavy exercise
                </button>
              </b-button-group>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      msgType: 'message',
      loading: true,
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
  },
  watch: {
    messages() {
      this.scrollToBottom();
    },
  },
  mounted() {
    this.getMessages();
    this.scrollToBottom();
  },
  beforeDestroy() {
    this.$nuxt.$off('newMessage');
  },
  methods: {
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
    async getMessages() {
      if (!this.$store.state.messages.length) {
        const Messages = this.$parse.Object.extend('Messages');
        const query = new this.$parse.Query(Messages);
        query.descending('createdAt').limit(50);

        try {
          const results = await query.find();

          const messages = [];

          for (const object of results) {
            const userId = object.get('userId');
            const activityLight = object.get('activityLight');
            const activityIntense = object.get('activityIntense');
            const activityDescription = object.get('activityDescription');
            const message = object.get('message');
            const createdAt = object.get('createdAt');

            messages.unshift({
              userId,
              activityLight,
              activityIntense,
              activityDescription,
              message,
              createdAt,
            });
          }

          this.$store.commit('setMessages', messages);
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
  },
};
</script>

<style lang="scss">
.page-activities {
  .chat {
    min-height: calc(100vh - 72px - 4rem);
    display: flex;
    flex-direction: column;
    justify-content: end;
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
      padding-right: 280px;
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
