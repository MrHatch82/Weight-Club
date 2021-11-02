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
          <h1>
            User Settings
          </h1>
        </div>
      </div>
    </div>
    <b-form @submit.prevent="saveSettings">
      <div class="row mb-1">
        <div class="col-12">
          <h2>General</h2>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Display Name">
            <b-form-input v-model="displayName" class="mb-3" placeholder="Something catchy..." :formatter="$sanitizeText" required />
          </b-form-group>
        </div>
      </div>
      <div class="row mb-1">
        <div class="col-12">
          <h2>Weight Tracking</h2>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Weight unit">
            <b-form-select v-model="weightUnit" :options="weightUnitOptions" class="mb-3" required />
          </b-form-group>
        </div>
        <div class="col-6 d-md-none"></div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Starting Weight">
            <b-form-input
              v-if="weightUnit === 'kg'"
              v-model="weightStart"
              placeholder="Where you're at"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
            <b-form-input
              v-if="weightUnit === 'stone'"
              v-model="weightStartStone.stone"
              placeholder="stone"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
            <b-form-input
              v-if="weightUnit === 'stone'"
              v-model="weightStartStone.lb"
              placeholder="lb"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
          </b-form-group>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Weight goal">
            <b-form-input
              v-if="weightUnit === 'kg'"
              v-model="weightGoal"
              placeholder="Where you want to end up"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
            <b-form-input
              v-if="weightUnit === 'stone'"
              v-model="weightGoalStone.stone"
              placeholder="stone"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
            <b-form-input
              v-if="weightUnit === 'stone'"
              v-model="weightGoalStone.lb"
              placeholder="lb"
              class="mb-3"
              :formatter="$sanitizeWeight"
              required
            />
          </b-form-group>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12">
          <h2>Nutrition Log</h2>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Track kcal">
            <b-form-select v-model="trackKcal" :options="boolOptions" class="mb-3" />
          </b-form-group>
        </div>
        <div v-if="trackKcal" class="col-6 col-md-4 col-lg-3">
          <b-form-group label="kcal limit">
            <b-form-input v-model="kcalLimit" placeholder="Intended daily intake" class="mb-3" :formatter="$sanitizeWeight" required />
          </b-form-group>
        </div>
        <div class="col-6 col-md-4 col-lg-3">
          <b-form-group label="Track ml">
            <b-form-select v-model="trackMl" :options="boolOptions" class="mb-3" />
          </b-form-group>
        </div>
        <div v-if="trackMl" class="col-6 col-md-4 col-lg-3">
          <b-form-group label="ml goal">
            <b-form-input v-model="mlGoal" placeholder="Daily target" class="mb-3" :formatter="$sanitizeWeight" required />
          </b-form-group>
        </div>
      </div>
      <div class="row mb-5">
        <div v-if="!loading" class="col-lg-3">
          <b-button type="submit" variant="primary" class="btn btn-primary w-100 shadow-up mb-4">
            {{ settingsReady ? 'Save Settings' : 'Save Settings &amp; proceed' }}
          </b-button>
          <div v-if="!loading && success" class="text-center text-tertiary text-uppercase mb-4">
            <b>Successfully saved!</b>
          </div>
        </div>
        <div v-else class="col-lg-3 position-relative mt-3">
          <div class="spinner" />
        </div>
      </div>
      <div class="row">
        <div v-if="settingsReady" class="col-lg-3">
          <b-button variant="primary" class="btn btn-primary w-100 shadow-up mb-5" @click="logOut">
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
      weightStart: this.$store.state.weightStart,
      weightStartStone: {
        stone: this.$kgToStoneInt(this.$store.state.weightStart),
        lb: this.$kgToStoneLb(this.$store.state.weightStart),
      },
      weightGoal: this.$store.state.weightGoal,
      weightGoalStone: {
        stone: this.$kgToStoneInt(this.$store.state.weightGoal),
        lb: this.$kgToStoneLb(this.$store.state.weightGoal),
      },
      displayName: this.$store.state.displayName,
      weightUnitOptions: this.$store.state.weightUnitOptions,
      loading: false,
      success: false,
      settingsReady: false,
      trackKcal: this.$store.state.trackKcal,
      kcalLimit: this.$store.state.kcalLimit,
      trackMl: this.$store.state.trackMl,
      mlGoal: this.$store.state.mlGoal,
      boolOptions: [
        { value: true, text: 'Yes' },
        { value: false, text: 'No' },
      ],
    };
  },
  computed: {
    storedWeightUnit() {
      return this.$store.state.weightUnit;
    },
  },
  mounted() {
    const state = this.$store.state;
    this.settingsReady = state.userSettingsId && state.weightGoal && state.weightStart;
  },
  methods: {
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
          weightStart = this.$stoneToKg(this.weightStartStone, 10);
          weightGoal = this.$stoneToKg(this.weightGoalStone);
          console.log(weightStart, weightGoal);
        }

        userSettingsObject.set('userId', this.$store.state.loggedInUserId);
        userSettingsObject.set('weightUnit', this.weightUnit);
        userSettingsObject.set('weightStart', weightStart);
        userSettingsObject.set('weightGoal', weightGoal);
        userSettingsObject.set('displayName', this.displayName);
        userSettingsObject.set('trackKcal', this.trackKcal);
        userSettingsObject.set('trackMl', this.trackMl);
        try {
          await userSettingsObject.save();

          this.$store.commit('setUserSettings', {
            weightUnit: this.weightUnit,
            weightStart,
            weightGoal,
            trackKcal: this.trackKcal,
            kcalLimit: this.kcalLimit,
            trackMl: this.trackMl,
            mlGoal: this.mlGoal,
            displayName: this.displayName,
            userSettingsId: userSettingsObject.id,
          });

          this.$nextTick(() => {
            this.$parent.$parent.getDisplayNames();
            this.updateStatus();
          });

          if (firstVisit) {
            setTimeout(() => {
              this.$router.push('/');
            }, 1000);
          }
        } catch (error) {
          console.error('Error while saving Weight: ', error);
        }
      }
    },
    async updateStatus() {
      const state = this.$store.state;
      console.log(state.weightStart, state.weightGoal);
      await this.$parse.Cloud.run('setStatus', {
        date: parseInt(this.$moment().format('YYYYMMDD'), 10),
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
