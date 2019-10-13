import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import resource from './module/system/resource'
import role from './module/system/role'
import systemUser from './module/system/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    resource,
    role,
    systemUser
  }
})
