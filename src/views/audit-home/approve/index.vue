<template>
  <div>
    <rest-apv v-if="formName == '休班'" :approve="approve"></rest-apv>
    <leave-apv v-if="formName == '请假'" :approve="approve"></leave-apv>
    <sign-in-apv v-if="formName == '上下班异常报到'" :approve="approve"></sign-in-apv>
    <night-apv v-if="formName == '夜间工作时间明细'" :approve="approve"></night-apv>
    <patrol-apv v-if="formName == '巡山异常报到'" :approve="approve"></patrol-apv>
    <field-work-plan-apv v-if="formName == '林地工作计划'" :approve="approve"></field-work-plan-apv>
    <field-work-time-apv v-if="formName == '林班工作时间明细'" :approve="approve"></field-work-time-apv>
    <manager-apv v-if="formName == '协管记录'" :approve="approve"></manager-apv>
    <footbar>
      <van-col span="12">
        <van-button @click="submit('disagree')" style="width:100%;height:40px;" type="warning">不同意</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="submit('agree')" style="width:100%;height:40px;" type="primary">同意</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import RestApv from './rest'
import LeaveApv from './leave'
import SignInApv from './sign-in'
import PatrolApv from './patrol'
import ManagerApv from './manager'
import FieldWorkPlanApv from './field-work-plan'
import FieldWorkTimeApv from './field-work-time'
import NightApv from './night'
import request from '@/utils/httpUtil'
import { API } from '@/api'

export default {
  name: 'approve',
  data() {
    return {
      approve: {},
      formName: '',
      detail_api_url: '',
      submit_api_url: '',
      apv: {
        apvResult: '',
        apvNote: ''
      }
    }
  },
  mounted() {
    this.formName = this.$route.params.type || ''
    this.$nextTick(() => {
      this.details()
    })
    this.$title(this.formName + '申请')
  },
  watch: {
    formName(val) {
      let submit = ''
      let detail = ''
      let apiKey = ''
      switch (val) {
        case '请假':
          apiKey = this.$route.query.node === '审批' ? 'DINGTALK_APPROVE_LEAVE_AUDIT' : 'DINGTALK_APPROVE_LEAVE_VERIFY'
          detail = API.DINGTALK_APPROVE_LEAVE_DETAIL
          submit = API.DINGTALK_APPROVE_LEAVE_VERIFY
          submit = API[apiKey]
          break
        case '休班':
          apiKey =
            this.$route.query.node === '审批' ? 'DINGTALK_APPROVE_OFFDUTY_AUDIT' : 'DINGTALK_APPROVE_OFFDUTY_VERIFY'
          detail = API.DINGTALK_APPROVE_OFFDUTY_DETAIL
          submit = API[apiKey]
          break
        case '上下班异常报到':
          detail = API.DINGTALK_APPROVE_SIGNIN_DETAIL
          submit = API.DINGTALK_APPROVE_SIGNIN_VERIFY
          break
        case '林地工作计划':
          detail = API.DINGTALK_APPROVE_FOREST_DETAIL
          submit = API.DINGTALK_APPROVE_FOREST_VERIFY
          break
        case '夜间工作时间明细':
          detail = API.DINGTALK_APPROVE_NIGHT_DETAIL
          submit = API.DINGTALK_APPROVE_NIGHT_VERIFY
          break
        case '巡山异常报到':
          detail = API.DINGTALK_APPROVE_PATROL_DETAIL
          submit = API.DINGTALK_APPROVE_PATROL_VERIFY
          break
        case '协管记录':
          detail = API.DINGTALK_APPROVE_MANAGE_DETAIL
          submit = API.DINGTALK_APPROVE_MANAGE_VERIFY
          break
      }
      this.detail_api_url = detail
      this.submit_api_url = submit
    }
  },
  methods: {
    openApvHist() {
      this.showApvHist = !this.showApvHist
    },
    details() {
      let that = this
      this.$loadingState(true, '数据加载中')
      if (this.formName !== '林班工作时间明细') {
        request
          .get(this.detail_api_url + this.$route.params.id)
          .then(resp => {
            this.$loadingState(false)
            let errCode = resp.data.errorCode
            let data = resp.data.data || {}
            if (errCode) {
              that.approve = data
            } else {
              dAlert(resp.data.msg)
            }
          })
          .catch(errr => this.$loadingState(false))
      } else {
        let params = {
          formid: this.$route.params.id || '',
          apvResult: '同意',
          module: '林班工作时间',
          task: '查询记录',
          payload: {}
        }
        request
          .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
          .then(res => {
            this.$loadingState(false)
            let data = res.data || {}
            if (data.errorCode !== 0) {
              this.$dAlert(data.msg || '')
              return false
            }
            that.approve = data.data.data || {}
          })
          .catch(err => this.$loadingState(false))
      }
    },
    submit(apvResult) {
      let msg = ''
      let result = ''
      if (apvResult === 'agree') {
        msg = '确定提交【同意】吗？'
        result = '同意'
      } else if (apvResult === 'disagree') {
        msg = '确定提交【不同意】吗？'
        result = '不同意'
      }
      this.$dConfirm(msg || '确认提交吗？', data => {
        let params = {
          rowId: this.$route.params.id,
          result: result,
          type: '申请'
        }
        this.$loadingState(true, '数据提交中')
        if (this.formName !== '林班工作时间明细') {
          request
            .post(this.submit_api_url, params)
            .then(resp => {
              this.$loadingState(false)
              let errCode = resp.data.errorCode
              this.$dAlert(resp.data.msg, () => {
                if (errCode) {
                  this.$router.push({
                    name: '审核审批首页'
                  })
                }
              })
            })
            .catch(errr => this.$loadingState(false))
        } else {
          let params = {
            formid: this.$route.params.id || '',
            apvResult: result || '',
            module: '林班工作时间',
            task: '审批',
            payload: {}
          }
          request
            .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
            .then(res => {
              this.$loadingState(false)
              let data = res.data || {}
              this.$dAlert(data.msg, () => {
                if (data.errorCode === 0) {
                  this.$router.push({
                    name: '审核审批首页'
                  })
                }
              })
            })
            .catch(err => this.$loadingState(false))
        }
      })
    }
  },
  components: {
    Footbar,
    RestApv,
    LeaveApv,
    SignInApv,
    PatrolApv,
    ManagerApv,
    FieldWorkPlanApv,
    FieldWorkTimeApv,
    NightApv
  }
}
</script>

<style scoped></style>
