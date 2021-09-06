<template>
  <div class="page page-user-settings container">
    <div v-if="!settingsReady">
      <h1 class="mb-2">
        Welcome to Fat Friends!
      </h1>
      <p class="mb-5">
        Before you can get started, we need some basic info from you.
      </p>
    </div>
    <div v-else>
      <h1>User Settings</h1>
    </div>
    <b-form @submit.prevent="saveSettings">
      <div class="row">
        <div class="col-lg-3">
          <b-form-group label="Display Name" class="mb-4 m-lg-0">
            <b-form-input v-model="displayName" placeholder="Something catchy..." :formatter="$sanitizeText" required />
          </b-form-group>
        </div>
        <div class="col-lg-3">
          <b-form-group label="Weight unit">
            <b-form-select v-model="weightUnit" :options="weightUnitOptions" class="mb-3" required />
          </b-form-group>
        </div>
        <div class="col-lg-3">
          <b-form-group label="Starting Weight">
            <b-form-input v-model="weightStart" placeholder="Where you're at" class="mb-3" :formatter="$sanitizeWeight" required />
          </b-form-group>
        </div>
        <div class="col-lg-3">
          <b-form-group label="Weight goal">
            <b-form-input v-model="weightGoal" placeholder="Where you want to end up" class="mb-3" :formatter="$sanitizeWeight" required />
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div v-if="!loading" class="col-lg-3 offset-lg-9">
          <b-button type="submit" variant="primary" class="btn btn-primary w-100">
            {{ settingsReady ? 'Save' : 'Save &amp; proceed' }}
          </b-button>
        </div>
        <div v-else class="col-lg-3 offset-lg-9 position-relative mt-3">
          <div class="spinner" />
        </div>
      </div>
    </b-form>
    <div v-if="!loading && success" class="row mt-4">
      <div class="col-lg-3 offset-lg-9 text-center text-tertiary text-uppercase">
        <b>Successfully saved!</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weightUnit: this.$store.state.weightUnit,
      weightStart: this.$store.state.weightStart,
      weightGoal: this.$store.state.weightGoal,
      displayName: this.$store.state.displayName,
      weightUnitOptions: this.$store.state.weightUnitOptions,
      loading: false,
      success: false,
    };
  },
  computed: {
    settingsReady() {
      const state = this.$store.state;
      return state.userSettingsId && state.weightGoal && state.weightStart;
    },
  },
  methods: {
    async saveSettings() {
      if (this.weightUnit && this.weightStart && this.weightGoal) {
        this.loading = true;
        this.success = false;

        let userSettingsObject = new this.$parse.Object('UserSettings');
        let firstVisit = false;

        if (this.$store.state.userSettingsId) {
          const userSettings = this.$parse.Object.extend('UserSettings');
          userSettingsObject = await new this.$parse.Query(userSettings).get(this.$store.state.userSettingsId);
        } else {
          firstVisit = true;
        }

        userSettingsObject.set('userID', this.$store.state.loggedInUserId);
        userSettingsObject.set('weightUnit', this.weightUnit);
        userSettingsObject.set('weightStart', parseInt(this.weightStart, 10));
        userSettingsObject.set('weightGoal', parseInt(this.weightGoal, 10));
        userSettingsObject.set('displayName', this.displayName);
        try {
          await userSettingsObject.save();

          this.$store.commit('setUserSettings', {
            weightUnit: this.weightUnit,
            weightStart: parseInt(this.weightStart, 10),
            weightGoal: parseInt(this.weightGoal, 10),
            displayName: this.displayName,
            userSettingsId: userSettingsObject.id,
          });

          this.loading = false;
          this.success = true;

          if (firstVisit) {
            setTimeout(() => {
              this.$router.push('/weight-tracking');
            }, 1000);
          }
        } catch (error) {
          console.error('Error while saving Weight: ', error);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.page-user-settings {
  .col-form-label {
    color: $tertiary;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}
</style>
