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
    // let secods = 0,
    //   intervalFunc = null
    // if (store.state.devAlertShow) {
    //   intervalFunc = setInterval(() => {
    //     secods += 1
    //   }, 1000)
    // }
    catkic.getLocation(
      200, // 精确度(m)
      result => {
        // alert('定位时长' + secods + '秒 \n' + JSON.stringify(result))
        let ggPoint = new BMap.Point(result.longitude, result.latitude)
        var convertor = new BMap.Convertor()
        // 坐标转换
        convertor.translate([ggPoint], 1, 5, data => {
          if (data.status === 0) {
            let point = data.points[0]
            if (elId) {
              let map = new BMap.Map(elId)
              map.centerAndZoom(point, 15)
              map.setCenter(point)
              let mk = new BMap.Marker(point)
              map.addOverlay(mk)
            }
            // 查询中文地址
            let geoc = new BMap.Geocoder()
            geoc.getLocation(point, function(rs) {
              // dAlert('定位+经纬度转换+地址转换获取时长为' + secods + '秒')
              // clearInterval(intervalFunc)
              let addComp = rs.addressComponents
              successCb &&
                successCb({
                  result: Object.assign({}, result, point),
                  position: {
                    lat: (point.lat || 0).toFixed(6),
                    lng: (point.lng || 0).toFixed(6)
                  },
                  formattedAddress:
                    addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
                })
            })
          }
        })
      },
      error => {
        // clearInterval(intervalFunc)
        errorCb && errorCb(error)
      }
    )
  }
  _vue.prototype.$catkicLocation = catkicLocation
  // const baiduMap = (elId, successCb, errorCb, noConfirm = true) => {
  //   // let secods = 0,
  //   //   intervalFunc = null
  //   // if (store.state.devAlertShow) {
  //   //   intervalFunc = setInterval(() => {
  //   //     secods += 1
  //   //   }, 1000)
  //   // }
  //   navigator.baidulocation.getLocation(
  //     function(result) {
  //       if (result.locType !== 61) {
  //         baiduMap(elId, successCb, errorCb)
  //         // clearInterval(intervalFunc)
  //         return false
  //       }
  //       // if (store.state.devAlertShow) {
  //       //   alert('定位时长' + secods + '秒 \n' + JSON.stringify(result))
  //       alert(JSON.stringify(result))
  //       // }
  //       let point = new BMap.Point(result.longitude, result.latitude)
  //       if (elId) {
  //         let map = new BMap.Map(elId)
  //         map.centerAndZoom(point, 15)
  //         let mk = new BMap.Marker(point)
  //         map.addOverlay(mk)
  //         map.panTo(point)
  //       }
  //       if (!result.addr) {
  //         let geoc = new BMap.Geocoder()
  //         geoc.getLocation(point, function(rs) {
  //           // if (store.state.devAlertShow) {
  //           //   dAlert('定位+地址获取时长为' + secods + '秒')
  //           // }
  //           // clearInterval(intervalFunc)
  //           let addComp = rs.addressComponents
  //           successCb &&
  //             successCb({
  //               position: {
  //                 lat: (result.latitude || 0).toFixed(6),
  //                 lng: (result.longitude || 0).toFixed(6)
  //               },
  //               formattedAddress:
  //                 addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
  //             })
  //         })
  //       } else {
  //         successCb &&
  //           successCb({
  //             position: {
  //               lat: (result.latitude || 0).toFixed(6),
  //               lng: (result.longitude || 0).toFixed(6)
  //             },
  //             formattedAddress: result.addr
  //           })
  //       }
  //     },
  //     function(error) {
  //       if (noConfirm) {
  //         if (error.message === 'Position retrieval timed out.') {
  //           dConfirm('定位超时，是否重新定位', () => {
  //             store.commit('loadingState', { isLoading: true, loadingText: '正在定位' })
  //             baiduMap(elId, successCb, errorCb)
  //           })
  //         } else {
  //           dAlert(error.describe ? error.describe : '定位失败,请检查定位权限是否打开')
  //         }
  //       }
  //       errorCb && errorCb(error)
  //       // 定位失败回调方法
  //       // error - 定位失败错误对象
  //     },
  //     { timeout: store.state.locateTimout || 40000 }
  //   )
  // }
  // _vue.prototype.$baiduMap = baiduMap

  _vue.component('VueElementLoading', VueElementLoading)
  _vue.prototype.$loadingState = (state, msg) => {
    store.commit('loadingState', {
      isLoading: state,
      loadingText: msg
    })
  }
}
