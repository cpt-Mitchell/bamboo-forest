import axios from 'axios'
import { API } from '@/api'
import store from '@/store'
import router from '@/router'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

const fetch = axios.create({
  // baseURL: 'https://wxmp.hwagain.com/api/' || process.env.VUE_APP_BASE_API || '',
  baseURL: /* '/apitest' || */ process.env.VUE_APP_BASE_API || '',
  timeOut: 5000
  // onUploadProgress: p=> {
  //     console.log(p)
  //     if (progressEvent.lengthComputable){
  //         return Math.round((p.loaded * 100) / p.total)
  //     }
  // }
})

fetch.interceptors.request.use(
  config => {
    // let prefixUrl = config.url.split('/')
    // if (
    //   // config.url !== 'dingtalk/forestry/information' &&
    //   process.env.VUE_APP_TEST_API.indexOf(prefixUrl[0] + '/' + prefixUrl[1]) !== -1
    // ) {
    //   config.baseURL = process.env.VUE_APP_BASE_TEST_API
    // }
    if (API.HWAGAIN_LOGIN !== config.url && store.state.appUser) {
      config.headers.common['Authorization'] = store.state.appUser.token
    }
    return config
  },
  error => {}
)

fetch.interceptors.response.use(
  res => {
    return res
  },
  error => {
    store.commit('loadingState', {
      isLoading: false,
      loadingText: ''
    })
    if (error.response) {
      let errMsg = ''
      switch (error.response.status) {
        // case 401:
        //   console.error('token is out of time');
        //   errMsg = '登录信息获取失败'
        //   break;
        case 500:
          errMsg = '系统异常，请联系开发人员'
          break
        case 503:
          errMsg = '核心依赖未启动，请联系技术人员'
          break
        case 401:
          errMsg = '登录失效，将重新获取用户信息'
          window.localStorage.removeItem('appUser')
          break
      }
      if (error.response.status === 401) {
        store.commit('clearUser', () => {
          router.push('/login')
        })
        return false
      } else if (errMsg) {
        dAlert(errMsg || error.response.message || '接口异常:' + error.response.status)
      }
    } else {
      dAlert(error.message || error.msg)
    }
    return Promise.reject(error.response)
  }
)
export default fetch
