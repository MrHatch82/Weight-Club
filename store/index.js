export const state = () => ({
  weightUnit: null,
  weightUnitOptions: [
    { value: null, text: 'How to measure your greatness' },
    { value: 'kg', text: 'kg' },
    { value: 'stone', text: 'Stone' },
  ],
  weightStart: null,
  weightGoal: null,
  displayName: null,
  loggedInUserId: null,
  userSettingsId: null,
});

export const mutations = {
  changeweightUnit(state, unit) {
    state.weightUnit = unit;
  },
  userLoggedIn(state, userId) {
    state.loggedInUserId = userId;
  },
  setUserSettings(state, payload) {
    state.weightUnit = payload.weightUnit;
    state.weightStart = payload.weightStart;
    state.weightGoal = payload.weightGoal;
    state.displayName = payload.displayName;
    state.userSettingsId = payload.userSettingsId;
  },
};
