import Vue from 'vue'
import Vuex from 'vuex'
import appStore from './module/app'
import userStore from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    app: appStore,
    user: userStore
  }
})
