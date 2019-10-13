export default {
  state: {
    resourceTree: []
  },
  getters: {
  },
  mutations: {
    setResourceTree (state, resourceTree) {
      state.resourceTree = resourceTree
    },
    clearResource (state) {
      state.resourceTree = []
    }
  },
  actions: {
  }
}
