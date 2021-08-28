<template>
  <div class="home container text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center position: relative;">
    <transition name="fade">
      <div v-if="loading" key="spinner" class="spinner" />
      <div v-else key="login">
        <p :class="{ 'text-danger' : error}" v-html="error || 'Please log in'" />
        <b-form class="mb-2" @submit.prevent="login">
          <b-form-input v-model="name" placeholder="Name"></b-form-input>
          <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>
          <b-button type="submit" variant="primary">
            Submit
          </b-button>
        </b-form>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      password: '',
      loading: false,
      error: null,
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
      this.loading = true;

      try {
        const user = await this.$parse.User.logIn(this.name, this.password);
        this.$store.commit('userLoggedIn', user.id);

        this.$router.push('/chart');
      } catch (error) {
        this.loading = false;
        this.error = error;
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

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border: 4px solid $primary;
    border-bottom: 4px solid $secondary;
    border-top: 4px solid $secondary;
    border-radius: 50%;
    animation: spin 1s linear infinite ;
  }

  @keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
}
</style>
