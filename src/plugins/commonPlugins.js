import 'lib-flexible/flexible'
import '@/plugins/registerServiceWorker'
import '@/errorLog'
import VantUI from './vant-ui'
import { Dialog } from 'vant'
import 'public/css/main.less'
import store from '@/store'
import VueElementLoading from 'vue-element-loading'

// import { gaoDeToBaidu } from '@/utils'

// eslint-disable-next-line
export const initPlugins = _vue => {
  new VantUI().init(_vue)
  const FastClick = require('fastclick')
  FastClick.attach(document.body)

  window.dAlert = function(msg, successCb) {
    if (!msg) return false
    Dialog.alert({
      message: msg
    }).then(() => {
      successCb && successCb()
    })
  }

  window.dConfirm = function(msg, cb1, cb2) {
    if (!msg) return false
    Dialog.confirm({ title: '提示', message: msg || '' })
      .then(() => {
        // on confirm
        cb1 && cb1()
      })
      .catch(() => {
        // on cancel
        cb2 && cb2()
      })
  }
  _vue.prototype.$title = title => {
    if (!title) {
      return false
    }
    document.title = title || ''
  }
  _vue.prototype.$dAlert = window.dAlert
  _vue.prototype.$dConfirm = window.dConfirm
  const catkicLocation = (elId, successCb, errorCb) => {
    window.ZLAPP.postMessage(
      JSON.stringify({
        method: 'getAppLocation',
        accuracy: window.serveAccuracy || 100, // 精度
        getResult: 'window.AppLocationInfo'
      })
    )
    let i = 0
    let interval = setInterval(() => {
      i++
      if (i > 30) {
        clearInterval(interval)
        errorCb && errorCb('定位超时，请重试')
      }
      if (window.AppLocationInfo) {
        try {
          window.AppLocationInfo = window.AppLocationInfo.replace(/\'/g, '"')
          let result = JSON.parse(window.AppLocationInfo)
          let point = new BMap.Point(result.longitude, result.latitude)
          if (elId) {
            let map = new BMap.Map(elId)
            map.centerAndZoom(point, 15)
            map.setCenter(point)
            let mk = new BMap.Marker(point)
            map.addOverlay(mk)
          }
          successCb &&
            successCb({
              result: Object.assign({}, result, point),
              position: {
                lat: (result.latitude || 0).toFixed(6),
                lng: (result.longitude || 0).toFixed(6)
              },
              formattedAddress: result.address
            })
          clearInterval(interval)
          window.AppLocationInfo = ''
          i = 0
        } catch (e) {
          clearInterval(interval)
          window.AppLocationInfo = ''
          errorCb && errorCb('定位失败，请重试')
        }
      }
    }, 1000)
  }
  _vue.prototype.$catkicLocation = catkicLocation

  _vue.component('VueElementLoading', VueElementLoading)
  _vue.prototype.$loadingState = (state, msg) => {
    store.commit('loadingState', {
      isLoading: state,
      loadingText: msg
    })
  }
}

export const TakePhoto = function(cb1, cb2) {
  cameraPlugin(1, cb1, cb2)
}

export const GetPhoto = function(cb1, cb2) {
  cameraPlugin(2, cb1, cb2)
}

const cameraPlugin = (type, cb1, cb2) => {
  window.ZLAPP.postMessage(
    JSON.stringify({
      method: 'getCamera',
      type: type, // 1为拍照 2为相册
      getResult: 'window.AppCameraImageBase64'
    })
  )
  let interval = setInterval(() => {
    if (window.AppCameraImageBase64 !== undefined && window.AppCameraImageBase64 !== null) {
      // 返回空字符串表示取消了拍照或者选择
      if (window.AppCameraImageBase64.length === 0) {
        clearInterval(interval)
      } else {
        try {
          cb1 && cb1({ base64: window.AppCameraImageBase64, name: new Date().getTime() + '' })
          window.AppCameraImageBase64 = null // 清空结果 防止下次取到同样的图片
        } catch (e) {
          cb2 && cb2()
        }
        clearInterval(interval)
      }
    }
  }, 800)
}
