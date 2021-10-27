<template>
  <div class="home container text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <logo :show-subtitle="true" class="logo" />
    <div>
      <div ref="loginWrapper" class="position-relative mb-5">
        <h1 class="p m-0">
          Fat Friends is a communal weight loss platform.
        </h1>
        <p class="mb-5">
          <b>It is not a weight loss program.</b>
          Its sole purpose is to bring people together in their weight loss endeavour, to prevent falling off the wagon, to have fun and maybe get some tips along the way.
        </p>
        <transition v-if="!userLoggedIn" name="fade">
          <div v-if="loading" key="spinner" class="spinner" />
          <div v-else key="login">
            <p class="text-secondary" :class="{ 'text-danger' : error}" v-html="error || 'Please log in to get started.'" />
            <b-form class="mb-2" @submit.prevent="login">
              <b-form-input v-model="name" placeholder="Name"></b-form-input>
              <b-form-input v-model="password" type="password" placeholder="Password"></b-form-input>
              <b-checkbox v-model="remember" class="mb-3">
                Remember me
              </b-checkbox>
              <b-button type="submit" variant="primary" class="btn shadow-up">
                Submit
              </b-button>
            </b-form>
          </div>
        </transition>
        <div v-else>
          <h2 v-if="displayName" class="text-secondary mb-4">
            Hello, {{ displayName }}!
          </h2>
          <b-button variant="primary" class="btn shadow-up" @click="logOut">
            Log out
          </b-button>
        </div>
        <small>Closed Beta v0.0.1</small>
      </div>
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
      remember: false,
    };
  },
  computed: {
    userLoggedIn() {
      return this.$store.state.loggedInUserId !== null;
    },
    displayName() {
      return this.$store.state.displayName;
    },
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
        const sessionToken = user.getSessionToken();
        if (process.client && this.remember) {
          localStorage.setItem('sessionToken', sessionToken);
        }
        this.$store.commit('userLoggedIn', user.id);
        this.$nuxt.$emit('userLoggedIn');
      } catch (error) {
        this.loading = false;
        this.error = error;
      }
    },
    logOut() {
      localStorage.removeItem('sessionToken');
      this.$store.commit('userLoggedIn', null);
      this.$store.commit('setUserSettings', {
        weightUnit: null,
        weightStart: null,
        weightGoal: null,
        trackKcal: null,
        kcalLimit: null,
        trackMl: null,
        mlGoal: null,
        displayName: null,
        userSettingsId: null,
      });
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss">
.home {
  small {
    opacity: 0.3;
  }

  .logo {
    width: 250px;
    margin-bottom: 4rem;

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
