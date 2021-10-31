<template>
  <div class="home container text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
    <logo :show-subtitle="true" class="logo" />
    <div>
      <div ref="loginWrapper" class="position-relative mb-5">
        <transition name="fade">
          <div v-if="!userLoggedIn" key="login">
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
                <p class="text-secondary" :class="{ 'text-danger' : error}" v-html="error || 'Please log in or sign up to get started.'" />
                <div v-if="!signUp">
                  <b-form class="mb-2" @submit.prevent="login">
                    <b-form-input v-model="name" placeholder="Name" required></b-form-input>
                    <b-form-input v-model="password" type="password" placeholder="Password" required></b-form-input>
                    <b-form-checkbox v-model="remember" class="mb-3">
                      Remember me
                    </b-form-checkbox>
                    <b-button type="submit" variant="primary" class="btn shadow-up">
                      Log in
                    </b-button>
                  </b-form>
                  <p>or <a href="#" class="text-underlined" @click="signUp = true">sign up</a></p>
                </div>
                <b-form v-else class="mb-2" @submit.prevent="signUpUser">
                  <b-form-input v-model="name" placeholder="Name" required></b-form-input>
                  <b-form-input v-model="password" type="password" placeholder="Password" required></b-form-input>
                  <b-form-input v-model="alphaPass" type="password" placeholder="Alpha Pass" required></b-form-input>
                  <b-button type="submit" variant="primary" class="btn shadow-up">
                    Sign up
                  </b-button>
                </b-form>
                <h3 class="text-primary">
                  {{ success }}
                </h3>
              </div>
            </transition>
          </div>
          <div v-if="displayName" key="logout">
            <h2 class="text-secondary mb-4">
              Hello, {{ displayName }}!
            </h2>
            <b-button variant="primary" class="btn shadow-up" @click="logOut">
              Log out
            </b-button>
          </div>
        </transition>
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
      alphaPass: '',
      loading: false,
      error: null,
      success: null,
      remember: false,
      signUp: false,
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
    async signUpUser() {
      this.remember = false;
      if (this.alphaPass === 'Penis123!') {
        this.loading = true;

        const user = new this.$parse.User();
        user.set('username', this.name);
        user.set('password', this.password);

        try {
          const userResult = await user.signUp();
          this.error = null;
          this.success = `User ${userResult.get('username')} created successfully!`;
          this.$parse.User.logOut();
          this.signUp = false;
          this.password = '';
        } catch (error) {
          this.error = 'Error: ' + error.code + ' ' + error.message;
        }
      } else {
        this.error = 'Wrong Alpha Pass!';
      }

      this.loading = false;
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
      this.name = '';
      this.password = '';
      this.loading = false;
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
