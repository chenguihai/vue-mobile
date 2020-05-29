export default {
  changeCluesCategory (content, category) {
    content.commit('changeCluesCategory', category)
  },
  serviceShowAdd (content, category) {
    content.commit('serviceShowAdd', category)
  }
  // async actionA ({ commit }) {
  //   commit('gotData', await getData())
  // },
}
