<template>
  <div class="login-wrap">
    <p class="login-title">
      <!-- <span>华劲竹林</span> -->
      <img :src="require('./logo.png')" />
    </p>
    <van-cell-group style="padding:0 1rem;">
      <van-field v-model="username" clearable label="用户名" right-icon="question-o" placeholder="请输入用户名" />
      <van-field
        :type="pwdShow ? 'text' : 'password'"
        v-model="password"
        clearable
        label="密码"
        right-icon="eye-o"
        placeholder="请输入密码"
        @click-right-icon="togglePwd"
      />
      <van-row>
        <van-col span="12" align="left">
          <van-checkbox v-model="isRemember" shape="square">7天内免登</van-checkbox>
        </van-col>
        <van-col span="12" align="right">
          <!-- <router-link tag="a" to="/updatePwd" style="color: #fff;font-size: .32rem;">修改密码</router-link> -->
          <router-link tag="a" :to="{ path: '/updatePwdByPhone' }" style="color: #fff;font-size: .32rem;"
            >修改密码</router-link
          >
        </van-col>
      </van-row>
      <van-button style="width:100%;position:relative;top:40px" type="info" @click="submit">登录</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import store from '@/store'
import { API } from '@/api'
import request from '@/utils/httpUtil'

export default {
  data() {
    return {
      loadingText: '',
      isLoading: false,
      isRemember: !!localStorage.getItem('expires'),
      username: localStorage.getItem('loginName') || '',
      password: '',
      pwdShow: false
    }
  },
  methods: {
    togglePwd() {
      this.pwdShow = !this.pwdShow
    },
    submit() {
      if (!this.username || !this.password) {
        this.$dAlert('请输入用户名或密码')
        return false
      }
      this.$loadingState(true, '正在登录')
      let params = { username: this.username, password: this.password, imei: this.$store.state.deviceUuid || 1 }
      request
        .post(API.HWAGAIN_LOGIN, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data
          if (data.errorCode === 200) {
            const cb = () => {
              if (this.isRemember) {
                localStorage.setItem('expires', 7 * 24 * 3600 * 1000 + new Date().getTime())
                localStorage.setItem('password', this.password)
              }
              localStorage.setItem('loginName', this.username)
              this.$router.replace('/apps')
            }
            store.dispatch('doLogin', { data: res.data, cb })
          } else {
            dAlert(res.data.msg || '登录失败')
            return false
          }
        })
        .catch(err => {
          this.$loadingState(false)
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
  }
}
</script>
<style lang="less">
.login-wrap {
  .van-checkbox {
    font-size: 0.32rem !important;
  }
  .van-checkbox__label {
    color: #fff;
    margin-left: 5px;
  }
  .van-checkbox__icon {
    font-size: 0.32rem;
    height: 0.32rem !important;
  }
  .van-checkbox__icon,
  .van-checkbox__label {
    line-height: 0.32rem !important;
  }
  .van-checkbox__icon .van-icon {
    font-size: 0.36rem !important;
    width: 0.36rem !important;
    height: 0.36rem !important;
  }
}
</style>
