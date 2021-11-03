<template>
  <div class="layout-default d-flex flex-column">
    <topnav ref="topnav" />
    <div v-if="settingsReady" class="gradient-overlay"></div>
    <Nuxt :key="key" />
    <div class="copyright d-none d-lg-block">
      FAT FRIENDS {{ $store.state.version }}
      © {{ $moment().format('YYYY') }} <a href="https://christof-hardt.de" target="_blank">
        Christof Hardt
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: 0,
    };
  },
  head() {
    return {
      title: `FAT FRIENDS ${this.$store.state.version}`,
    };
  },
  computed: {
    settingsReady() {
      const state = this.$store.state;
      return state.userSettingsId && state.weightGoal && state.weightStart;
    },
  },
  created() {
    // Parse init
    this.$parse.initialize(
      this.$config.appId, // This is your Application ID
      this.$config.jsKey, // This is your Javascript key
    );
    this.$parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL

    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      this.loginWithSessionToken(sessionToken);
    }

    // Subscribe to chat messages
    this.$nuxt.$on('userLoggedIn', () => {
      this.getUserSettings(this.$route.path === '/');
      this.initChatLiveQuery();
      this.getDisplayNames();
    });
  },
  methods: {
    async loginWithSessionToken(token) {
      const user = await this.$parse.User.become(token);
      this.$store.commit('userLoggedIn', user.id);
      this.$nuxt.$emit('userLoggedIn');

      if (this.$route.path === '/' && this.$store.state.userSettingsId) {
        setTimeout(() => {
          this.$router.push({
            path: '/friends-ranking',
          });
        }, 1500);
      }
    },
    async getDisplayNames() {
      const Users = this.$parse.Object.extend('UserSettings');
      const query = new this.$parse.Query(Users);

      try {
        const results = await query.find();

        const displayNames = {};

        for (const object of results) {
          displayNames[object.get('userId')] = object.get('displayName');
        }

        this.$store.commit('setDisplayNames', displayNames);
      } catch (error) {
        console.error('Error while fetching Messages', error); // eslint-disable-line
      }
    },
    initChatLiveQuery() {
      const client = new this.$parse.LiveQueryClient({
        applicationId: this.$config.appId,
        serverURL: 'wss://fatfriends.b4a.io', // Example: 'wss://livequerytutorial.back4app.io'
        javascriptKey: this.$config.jsKey,
      });
      client.open();

      const query = new this.$parse.Query('Messages');
      query.ascending('createdAt').limit(5);
      const subscription = client.subscribe(query);

      subscription.on('create', (msg) => {
        const message = {
          createdAt: msg.get('createdAt'),
          userId: msg.get('userId'),
          exerciseLight: msg.get('exerciseLight'),
          exerciseHeavy: msg.get('exerciseHeavy'),
          message: msg.get('message'),
        };

        this.$refs.topnav.messageReceived();

        if (message.userId !== this.$store.state.loggedInUserId) {
          if (this.$store.state.messages.length) {
            this.$store.commit('appendMessages', message);
          }
        }
      });
    },
    async getUserSettings(redirect = false) {
      const state = this.$store.state;
      const UserSettings = this.$parse.Object.extend('UserSettings');
      const query = new this.$parse.Query(UserSettings);
      query.equalTo('userId', state.loggedInUserId);
      try {
        const object = await query.first();

        if (object) {
          this.$store.commit('setUserSettings', {
            weightUnit: object.get('weightUnit'),
            weightStart: object.get('weightStart'),
            weightGoal: object.get('weightGoal'),
            displayName: object.get('displayName'),
            trackKcal: object.get('trackKcal'),
            kcalLimit: object.get('kcalLimit'),
            trackMl: object.get('trackMl'),
            mlGoal: object.get('mlGoal'),
            userSettingsId: object.id,
          });
        }
        if (redirect) {
          this.$nextTick(() => {
            if (!state.weightUnit || !state.weightStart || !state.weightGoal) {
              this.$router.push('/user-settings');
            }
          });
        } else {
          this.key += 1;
        }
      } catch (error) {
        console.error('Error while loading Settings', error);
      }
    },
  },
};
</script>

<style lang="scss">
.gradient-overlay {
    height: 1rem;
    width: 100%;
    position: fixed;
    top: $topnavHeightMobile;
    left: 0;
    background: linear-gradient(0deg, rgba(51,51,51,0) 0%, rgba(51,51,51,1) 70%);
    z-index: 20;

    @include media-breakpoint-up(lg) {
      height: 4rem;
      top: $topnavHeight;
    }

  }

.copyright {
  position: fixed;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 12px;
  opacity: 0.5;

  a, a:hover, a:focus {
    color: $light;
  }
}
</style>
