import store from '@/store'
import request from '@/utils/httpUtil'
import { API } from '@/api'

const reLogin = (successCb, errorCb) => {
  let password = ''
  let username = localStorage.getItem('loginName') || ''
  let expires = localStorage.getItem('expires') || 0
  if (expires && !isNaN(expires)) {
    let now = new Date().getTime()
    if (now < expires) {
      password = localStorage.getItem('password') || ''
    }
  } else {
    localStorage.removeItem('expires')
    localStorage.removeItem('password')
  }
  if (!username || !password) {
    errorCb && errorCb()
    return false
  }
  let params = { username: username, password: password, imei: store.state.deviceUuid || 1 }
  request
    .post(API.HWAGAIN_LOGIN, params)
    .then(res => {
      let data = res.data
      if (data.errorCode === 200) {
        store.dispatch('doLogin', { data: res.data, successCb })
      } else {
        errorCb && errorCb()
      }
    })
    .catch(err => {
      if (err.status === 400) {
        let msg = ''
        err.data.data.forEach(item => {
          msg += item.field + item.message + '\n'
        })
        this.$dAlert(msg)
      } else {
        this.$dAlert(err.statusText)
      }
    })
}
export const routerFilter = function(from, to, next) {
  store.commit('loadingState', { isLoading: false })
  if (['/login', '/updatePwd', '/updatePwdByPhone', '/updatePwdByPhone/finally'].indexOf(from.path) === -1) {
    // 当登录信息不存在且expires不存在时进入登录界面
    if (!store.state.appUser && !(localStorage.getItem('expires') || 0)) {
      next('/login')
      return false
    } else if (!store.state.appUser && !!(localStorage.getItem('expires') || 0)) {
      // 当登录信息不存在且expires存在时尝试取localstorage用户名密码进行登录
      reLogin(
        () => {
          next()
        },
        () => {
          next('/login')
          return false
        }
      )
    }
  }
  next()
}

export default routerFilter
