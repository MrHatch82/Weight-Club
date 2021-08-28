export const state = () => ({
  weightFormat: 'kg',
  loggedInUserId: null,
});

export const mutations = {
  changeWeightFormat(state, format) {
    state.weightFormat = format;
  },
  userLoggedIn(state, userId) {
    state.loggedInUserId = userId;
  },
};
