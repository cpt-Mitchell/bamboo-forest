import Vue from 'vue'
import App from './App'
import router from '@/router'
import { initPlugins } from '@/plugins/commonPlugins'
import HotUpdate from '@/plugins/hot-update'
import './permission'
import store from './store'
import checkPermission from './plugins/android-permission'
import request from '@/utils/httpUtil'
import { Dialog } from 'vant'
Vue.config.productionTip = false
store.commit('loadingState', { isLoading: false })
// document.addEventListener(
//   'deviceready',
//   function() {
//     var devicePlatform = device.platform
//     // var serialNo = device.serial
//     store.commit('updateDeviceUuid', device.uuid)
//     if (devicePlatform === 'Android') {
//       request
//         .get('https://www.hwagain.cn/hwagain/zhulinapk/version.json?t=' + new Date().getTime())
//         // .get('http://wxmp.hwagain.com:60008/hwagain/zhulinapk/version_test.json?t=' + new Date().getTime())
//         .then(data => {
//           cordova.getAppVersion
//             .getVersionNumber()
//             .then(function(version) {
//               if (!data.data) {
//                 Dialog.alert('版本检查失败')
//                 return false
//               }
//               data.data.data.currVersion = version
//               store.commit('updateVersion', data.data ? data.data.data : {})
//               if (version + '' !== data.data.data.version + '') {
//                 Dialog.alert({
//                   message: '已有最新版本【' + data.data.data.version + '】，请点击确认前往下载'
//                 })
//                   .then(() => {
//                     if (cordova.InAppBrowser) {
//                       cordova.InAppBrowser.open(data.data.data.link, '_system')
//                       navigator.app.exitApp()
//                       // window.location.href = data.data.data.link
//                       return false
//                     }
//                   })
//                   .catch(err => {
//                     dAlert(JSON.stringify(err))
//                   })
//               } else {
//                 HotUpdate()
//                   .then(data => {
//                     if (!data) {
//                       dAlert('检查资源更新失败')
//                       return false
//                     }
//                   })
//                   .catch(err => {
//                     dAlert('error: 检查资源更新失败')
//                   })
//               }
//             })
//             .catch(err => {
//               Dialog.alert('获取应用版本号失败')
//             })
//         })
//         .catch(err => {
//           Dialog.alert('版本检查失败')
//         })
//       checkPermission() // 检查安卓权限
//     }
    initPlugins(Vue)
    /* eslint-disable no-new */
    new Vue({
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
//     navigator.splashscreen.hide()
//   },
//   false
// )
