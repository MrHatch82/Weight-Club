<template>
  <div class="layout-default d-flex flex-column">
    <topnav ref="topnav" />
    <Nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    // Parse init
    this.$parse.initialize(
      this.$config.appId, // This is your Application ID
      this.$config.jsKey, // This is your Javascript key
    );
    this.$parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL

    // Subscribe to chat messages
    this.$nuxt.$on('userLoggedIn', () => {
      this.initChatLiveQuery();
      this.getDisplayNames();
    });
  },
  methods: {
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
  },
};
</script>
