export const state = () => ({
  version: 'Closed Alpha v0.0.3',
  weightUnit: null,
  weightUnitOptions: [
    { value: 'kg', text: 'kg' },
    { value: 'stone', text: 'Stone' },
  ],
  weightStart: null,
  weightGoal: null,
  displayName: null,
  trackKcal: null,
  kcalLimit: null,
  trackMl: null,
  mlGoal: null,
  loggedInUserId: null,
  userSettingsId: null,
  sessionToken: null,
  displayNames: {},
  messages: [],
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
    state.trackKcal = payload.trackKcal;
    state.kcalLimit = payload.kcalLimit;
    state.trackMl = payload.trackMl;
    state.mlGoal = payload.mlGoal;
  },
  setDisplayNames(state, payload) {
    state.displayNames = payload;
  },
  setMessages(state, payload) {
    state.messages = payload;
  },
  appendMessages(state, message) {
    state.messages.push(message);
  },
};
