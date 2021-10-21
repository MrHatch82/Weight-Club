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
      <div class="row">
        <div class="col-lg-9">
          <h1>User Settings</h1>
        </div>
      </div>
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
      <div class="row mb-4">
        <div v-if="!loading" class="col-lg-3 order-lg-2 offset-lg-6">
          <b-button type="submit" variant="primary" class="btn btn-primary w-100 shadow-up mb-4">
            {{ settingsReady ? 'Save' : 'Save &amp; proceed' }}
          </b-button>
        </div>
        <div v-else class="col-lg-3 order-lg-2 offset-lg-6 position-relative mt-3">
          <div class="spinner" />
        </div>
        <div v-if="!loading && success" class="col-lg-3 order-lg-3 offset-lg-9 text-center text-tertiary text-uppercase mb-4">
          <b>Successfully saved!</b>
        </div>
        <div class="col-lg-3 order-lg-1">
          <b-button variant="primary" class="btn btn-primary w-100 shadow-up mb-4" @click="logOut">
            log out
          </b-button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weightUnit: this.$store.state.weightUnit,
      lastWeightUnit: this.$store.state.weightUnit,
      weightStart: this.$store.state.weightUnit === 'kg' ? this.$store.state.weightStart : this.$kgToStone(this.$store.state.weightStart),
      weightGoal: this.$store.state.weightUnit === 'kg' ? this.$store.state.weightGoal : this.$kgToStone(this.$store.state.weightGoal),
      displayName: this.$store.state.displayName,
      weightUnitOptions: this.$store.state.weightUnitOptions,
      loading: false,
      success: false,
      settingsReady: false,
    };
  },
  computed: {
    storedWeightUnit() {
      return this.$store.state.weightUnit;
    },
  },
  watch: {
    weightUnit() {
      if (this.weightUnit !== null && this.weightUnit !== this.lastWeightUnit) {
        if (this.weightStart) {
          this.weightStart = this.weightUnit === 'kg' ? this.$stoneToKg(this.weightStart) : this.$kgToStone(this.weightStart);
        }
        if (this.weightGoal) {
          this.weightGoal = this.weightUnit === 'kg' ? this.$stoneToKg(this.weightGoal) : this.$kgToStone(this.weightGoal);
        }

        this.lastWeightUnit = this.weightUnit;
      }
    },
  },
  mounted() {
    const state = this.$store.state;
    this.settingsReady = state.userSettingsId && state.weightGoal && state.weightStart;
  },
  methods: {
    logOut() {
      localStorage.removeItem('sessionToken');
      window.location.href = '/';
    },
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

        let weightStart = parseFloat(this.weightStart);
        let weightGoal = parseFloat(this.weightGoal);
        if (this.weightUnit === 'stone') {
          weightStart = this.$stoneToKg(weightStart);
          weightGoal = this.$stoneToKg(weightGoal);
        }

        userSettingsObject.set('userId', this.$store.state.loggedInUserId);
        userSettingsObject.set('weightUnit', this.weightUnit);
        userSettingsObject.set('weightStart', weightStart);
        userSettingsObject.set('weightGoal', weightGoal);
        userSettingsObject.set('displayName', this.displayName);
        try {
          await userSettingsObject.save();

          this.$store.commit('setUserSettings', {
            weightUnit: this.weightUnit,
            weightStart,
            weightGoal,
            displayName: this.displayName,
            userSettingsId: userSettingsObject.id,
          });

          this.$parent.$parent.getDisplayNames();
          this.updateStatus();

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
    async updateStatus() {
      const state = this.$store.state;
      await this.$parse.Cloud.run('setStatus', {
        userId: state.loggedInUserId,
        userSettings: {
          weightStart: state.weightStart,
          weightGoal: state.weightGoal,
        },
      });
      this.loading = false;
      this.success = true;
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
