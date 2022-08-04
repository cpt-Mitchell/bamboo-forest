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
          v-model="form.password"
          :type="pwdShow?'text':'password'"
          label="新密码"
          placeholder="新密码"
          right-icon="eye-o"
          @click-right-icon="togglePwd"
        />
        <van-field
          required
          v-model="form.smsCode"
          autocomplete="off"
          label="验证码"
          placeholder="请输入验证码"
        />
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
        smsCode: '',
        password: ''
      },
      pwdShow: false
    }
  },
  methods: {
    togglePwd() {
      this.pwdShow = !this.pwdShow
    },
    doUpdate() {
      if (!this.form.password) {
        this.$dAlert('请输入新密码')
        return false
      }
      if (!this.form.smsCode) {
        this.$dAlert('请输入原密码')
        return false
      }
      this.$loadingState(true, '数据提交中')
      let params = {
        loginname: this.$route.params.username || '',
        phone: this.$route.params.phone || '',
        code: this.form.smsCode,
        newPassword: this.form.password
      }
      request.get(API.DINGTALK_RESETPWD_BY_PHONE, { params }).then(res => {
        this.$loadingState(false)
        this.loadingText = ''
        let data = res.data
        this.$dAlert(data.msg || '提交成功', () => {
          if (data.success) {
            this.$router.replace('/login')
          }
        })
      }).catch(err => {
        this.$loadingState(false)
        this.$dAlert('修改异常')
      })
    }
  },
  mounted() {
    if (!this.$route.params.valid || !this.$route.params.username || !this.$route.params.phone) {
      this.$dAlert('非法进入此页面，请重新操作', () => {
        this.$router.replace('/updatePwdByPhone')
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
