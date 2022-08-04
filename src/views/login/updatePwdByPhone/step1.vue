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
          v-model="form.userName"
          clearable
          label="用户名"
          right-icon="question-o"
          placeholder="请输入用户名"
        />
        <van-field
          required
          type="number"
          v-model="form.phone"
          autocomplete="off"
          label="手机号"
          placeholder="请输入手机号"
        />
      </van-cell-group>
      <van-button
        style="margin: 10px 0px 0px;width: 100%;position: fixed;bottom: 0;left: 0;right: 0;"
        type="primary"
        @click="openImgCodeDialog"
      >获取验证码</van-button>
    </div>
    <van-dialog v-model="show" title="请输入验证码" show-cancel-button @confirm="doNextAction">
      <div>
        <div
          class="van-cell-group van-hairline--top-bottom"
          style="padding: 0px 6px; box-sizing: border-box;"
        >
          <div class="van-cell van-field">
            <div class="van-cell__value">
              <div style="padding:10px 0 0 0;">
                <div style="width:100%;text-align:center">
                  <img
                    @click="reGetImgCode()"
                    :src="'data:image/jpeg;base64,'+imgObj"
                    style="height: 50px;"
                  >
                </div>
                <div style="text-align:center;padding:10px">
                  <input
                    v-model="form.imgCode"
                    maxlength="4"
                    autocomplete="off"
                    placeholder="请输入验证码"
                    class="van-field__control"
                    style="width:120px;padding:5px 10px;display:inline-block;border:1px solid #ccc;border-radius:5px;text-align:center"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
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
        userName: '',
        imgCode: '',
        phone: ''
      },
      show: false,
      imgObj: '',
      delaySconds: 0
    }
  },
  methods: {
    resetDelaySecond(state) {
      this.delaySconds = 120
      const interval = setInterval(() => {
        if (this.delaySconds <= 0) {
          clearInterval(interval)
        } else {
          this.delaySconds--
        }
      }, 1000)
    },
    doNextAction() {
      let params = {
        account: this.form.userName || '',
        code: this.form.imgCode || '',
        moduleType: '2',
        phone: this.form.phone || ''
      }
      request.post(API.DINGTALK_GET_SMS_CODE, params).then(res => {
        let data = res.data || ''
        if (data.success) {
          this.$router.push({ name: '短信修改密码', params: { valid: true, username: this.form.userName, phone: this.form.phone } })
        } else {
          this.$dAlert(data.msg || '获取短信验证码失败')
        }
      }).catch(err => {
        this.$loadingState(false)
        this.$dAlert('验证码验证异常' + (err.getMessage || ''))
      })
    },
    reGetImgCode() {
      const cb = (res) => {
        let data = res.data
        this.imgObj = data.data || ''
      }
      this.getImgCode(cb)
    },
    getImgCode(cb) {
      request.post(API.DINGTALK_CAPTCHA_IMG, { phone: this.form.phone, moduleType: '2' }).then(res => {
        cb && cb(res)
      }).catch(err => {
        this.$loadingState(false)
        this.$dAlert('获取图片验证码异常' + (err.getMessage || ''))
      })
    },
    openImgCodeDialog() {
      if (!this.form.userName) {
        this.$dAlert('请输入用户名')
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(this.form.phone))) {
        this.$dAlert('手机号填写有误')
        return false
      }
      console.log(this.delaySconds)
      if (this.delaySconds !== 0) {
        this.$dAlert('操作太频繁，请' + this.delaySconds + '秒后再进行操作')
        return false
      }
      this.imgObj = {}
      this.$loadingState(true, '请稍等')
      const cb = (res) => {
        this.$loadingState(false)
        this.loadingText = ''
        this.resetDelaySecond()
        let data = res.data
        if (data) {
          this.imgObj = data.data
          this.show = true
        } else {
          this.$dAlert(res.data.msg || '获取图片验证码失败')
          return false
        }
      }
      this.getImgCode(cb)
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
