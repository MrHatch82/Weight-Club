export const state = () => ({
  weightFormat: 'kg'
})

export const mutations = {
  changeWeightFormat(state, format) {
    state.weightFormat = format
  }
}
