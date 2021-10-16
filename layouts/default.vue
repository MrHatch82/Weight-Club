<template>
  <div class="layout-default d-flex flex-column">
    <topnav ref="topnav" />
    <div class="gradient-overlay"></div>
    <Nuxt :key="key" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: 0,
    };
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
    },
    async getDisplayNames() {
      const Users = this.$parse.Object.extend('UserSettings');
      const query = new this.$parse.Query(Users);

      try {
        const results = await query.find();

        const displayNames = {};

        for (const object of results) {
          displayNames[object.get('userID')] = object.get('displayName');
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
          activityLight: msg.get('activityLight'),
          activityIntense: msg.get('activityIntense'),
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
      query.equalTo('userID', state.loggedInUserId);
      try {
        const object = await query.first();

        if (object) {
          const weightUnit = object.get('weightUnit');
          const weightStart = object.get('weightStart');
          const weightGoal = object.get('weightGoal');
          const displayName = object.get('displayName');

          this.$store.commit('setUserSettings', {
            weightUnit,
            weightStart,
            weightGoal,
            displayName,
            userSettingsId: object.id,
          });
        }
        if (redirect) {
          this.$nextTick(() => {
            if (state.weightUnit && state.weightStart && state.weightGoal) {
              this.$router.push('/friends');
            } else {
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
    height: 4rem;
    width: 100%;
    position: fixed;
    top: 72px;
    left: 0;
    background: linear-gradient(0deg, rgba(51,51,51,0) 0%, rgba(51,51,51,1) 70%);
    z-index: 20;
  }
</style>
