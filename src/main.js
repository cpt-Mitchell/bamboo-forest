import Vue from 'vue'
import App from './App'
import router from '@/router'
import { initPlugins } from '@/plugins/commonPlugins'
import './permission'
import store from './store'
import axios from 'axios'

window.$axios = axios
Vue.config.productionTip = false
store.commit('loadingState', { isLoading: false })

initPlugins(Vue)
axios
  .get('http://www.hwagain.cn/hwagain/zhulinapk/flutter_version.json' || process.env.VUE_APP_VERSION_API)
  .then(res => {
    const result = res.data || {}
    window.serveAccuracy = result.accuracy || 100
  })
  .catch(err => {
    window.serveAccuracy = 150
    console.error('获取信息失败')
  })
window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
