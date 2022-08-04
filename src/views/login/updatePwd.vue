<template>
  <div class="update-passwd-form">
    <van-row>
      <van-col span="24">
        <van-nav-bar :title="$route.name" left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
      </van-col>
    </van-row>
    <div>
      <van-cell-group style="padding:0 6px;box-sizing:border-box;">
        <van-field
          required
          v-model="form.username"
          autocomplete="off"
          label="登录名"
          placeholder="请输入登录名"
        />
        <van-field required v-model="form.old"
        :type="pwdShow?'text':'password'" label="原密码" placeholder="原密码"
        right-icon="eye-o"
        @click-right-icon="togglePwd"/>
        <van-field required v-model="form.password" :type="pwdShow?'text':'password'" label="新密码" placeholder="新密码"
        right-icon="eye-o"
        @click-right-icon="togglePwd"/>
      </van-cell-group>
      <van-button
        style="margin: 10px 0px 0px;width: 100%;position: fixed;bottom: 0;left: 0;right: 0;"
        type="primary"
        @click="doUpdate"
      >提交</van-button>
    </div>
  </div>
</template>

<script>
import { API } from '@/api'
import request from '@/utils/httpUtil'
export default {
  data() {
    return {
      isLoading: false,
      loadingText: '',
      form: {
        username: '',
        old: '',
        password: ''
      },
      delaySend: 0,
      pwdShow: false
    }
  },
  methods: {
    togglePwd() {
      this.pwdShow = !this.pwdShow
    },
    doUpdate() {
      if (!this.form.username) {
        this.$dAlert('请输入登录名')
        return false
      }
      if (!this.form.old) {
        this.$dAlert('请输入原密码')
        return false
      }
      if (!this.form.password) {
        this.$dAlert('请输入新密码')
        return false
      }
      this.$loadingState(true, '数据提交中')
      request.post(API.HWAGAIN_UPDATE_PWD, Object.assign({}, this.form, { imei: this.$store.state.deviceUuid })).then(res => {
        this.$loadingState(false)
        this.loadingText = ''
        let data = res.data
        if (data.errorCode === 200) {
          this.$router.replace('/login')
        } else {
          dAlert(res.data.msg || '修改失败')
          return false
        }
      }).catch(err => {
        this.$loadingState(false)
        this.$dAlert('修改异常')
      })
    }
  }
}
</script>

<style lang="less">
.update-passwd-form {
  background: #f0f2f5;
  height: 100vh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .align-center input {
    text-align: center;
  }
  h2 {
    margin: 0;
    background: #f0f2f5;
    color: #333;
    font-size: 0.36rem;
    padding: 8px 15px;
  }
}
</style>
