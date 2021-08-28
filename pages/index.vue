<template>
  <div class="home container text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <div v-if="loading" class="spinner" />
    <div v-else>
      <p>Please log in</p>
      <b-form class="mb-2" @submit.prevent="login">
        <b-form-input v-model="name" placeholder="Name"></b-form-input>
        <b-form-input v-model="password" placeholder="Password"></b-form-input>
        <b-button type="submit" variant="primary">
          Submit
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      password: '',
      loading: false,
    };
  },
  mounted() {
    this.$parse.initialize(
      this.$config.appId, // This is your Application ID
      this.$config.jsKey, // This is your Javascript key
      // this.$config.masterKey, // This is your Master key (never use it in the frontend)
    );
    this.$parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  },
  methods: {
    async login() {
      try {
        const user = await this.$parse.User.logIn(this.name, this.password);
        this.$store.commit('userLoggedIn', user.id);

        this.$router.push('/ranking');
      } catch (error) {
        console.error('Error while logging in user', error);
      }
    },
  },
};
</script>

<style lang="scss">
.home {
  .fat {
    font-size: 24px;
    font-weight: 600;
  }

  input {
    width: 300px;
    margin: 0 auto 1rem;
  }
}
</style>
