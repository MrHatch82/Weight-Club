<template>
  <div class="home container text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <logo :show-subtitle="true" class="logo mb-5" />
    <div ref="loginWrapper" class="position-relative mb-5">
      <p class="mb-5">
        Fat Friends is a communal weight loss platform.<br>
        <b>It is not a weight loss program.</b>
        Its sole purpose is to bring people together in their weight loss endeavour, to prevent falling off the wagon, to have fun and maybe get some tips along the way.
      </p>
      <transition name="fade">
        <div v-if="loading" key="spinner" class="spinner" />
        <div v-else key="login">
          <p class="text-secondary" :class="{ 'text-danger' : error}" v-html="error || 'Please log in to get started.'" />
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
    this.$nextTick(() => {
      this.$refs.loginWrapper.style.height = `${this.$refs.loginWrapper.clientHeight}px`;
    });
  },
  methods: {
    async login() {
      this.loading = true;

      try {
        const user = await this.$parse.User.logIn(this.name, this.password);
        this.$store.commit('userLoggedIn', user.id);

        this.$router.push('/weight-tracking');
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
  .logo {
    width: 250px;

    img {
      margin-bottom: 0.25rem;
    }
  }

  p {
    max-width: 400px;
  }

  input {
    width: 200px;
    margin: 0 auto 1rem;
  }
}
</style>
