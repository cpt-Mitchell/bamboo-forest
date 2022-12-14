import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.localStorage
      // reducer (val) {
      //   return {
      //     // 只储存state中的user
      //     user: val.user
      //   }
      // }
    })
  ],
  state: {
    appUser: null,
    deviceUuid: '',
    devAlertShow: false,
    isLoading: false,
    loadingText: '',
    locateTimout: null
  },
  actions: {
    doLogin({ commit }, payload) {
      commit('cacheUser', payload)
    }
  },
  mutations: {
    loadingState(state, { isLoading, loadingText }) {
      state.isLoading = isLoading
      state.loadingText = loadingText
    },
    updateDeviceUuid(state, uuid) {
      if (!uuid) return false
      state.deviceUuid = uuid
    },
    cacheUser(state, { data, cb }) {
      let user = (data.msg || '').split(' ')
      let appLoginUser = { token: data.data, userName: user[0], id: user[1] }
      state.appUser = appLoginUser
      window.localStorage.setItem('appLoginUser', JSON.stringify(appLoginUser))
      cb && cb()
    },
    clearUser(state, cb) {
      state.appUser = null
      window.localStorage.removeItem('appLoginUser')
      window.localStorage.removeItem('expires')
      window.localStorage.removeItem('password')
      cb && cb()
    },
    getUser(state) {
      let str = window.localStorage.getItem('appLoginUser')
      if (str) {
        try {
          let jsonObj = JSON.parse(str)
          state.appUser = jsonObj
        } catch (e) {
          state.appUser = {}
          window.localStorage.removeItem('appLoginUser')
        }
      }
    }
  }
})
