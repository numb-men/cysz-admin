export default {
  state: {
    users: []
  },
  getters: {
  },
  mutations: {
    setUsers (state, users) {
      state.users = users
    },
    addUser (state, user) {
      state.users.push(user)
    }
  },
  actions: {
  }
}
