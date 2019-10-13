export default {
  state: {
    roles: []
  },
  getters: {
  },
  mutations: {
    setRoles (state, roles) {
      state.roles = roles
    },
    addRole (state, role) {
      state.roles.push(role)
    }
  },
  actions: {
  }
}
