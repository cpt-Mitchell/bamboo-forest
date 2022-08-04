<template>
  <div>
    <div class="card card-part">
      <van-field class="no-disabled_bgcolor" v-model="form.leaveType" label="请假类别" disabled/>
      <van-field
        type="textarea"
        class="no-disabled_bgcolor"
        v-model="form.leaveReason"
        label="请假事由"
        rows="1"
        autosize
        disabled
      />
      <van-field
        type="textarea"
        class="no-disabled_bgcolor"
        v-model="form.otherReason"
        label="其他理由"
        rows="1"
        autosize
        disabled
      />
      <van-field class="no-disabled_bgcolor" v-model="form.beginDate" label="值班开始时间" disabled/>
      <van-field class="no-disabled_bgcolor" v-model="form.endDate" label="值班结束时间" disabled/>
    </div>
    <div class="sub-head">
      <van-row>
        <van-col span="24">
          <span>审核审批历史</span>
        </van-col>
      </van-row>
    </div>
    <div class="card card-part">
      <apv-history :list="history"></apv-history>
    </div>
  </div>
</template>

<script>
import ApvHistory from '@/components/history-items'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      history: [],
      form: {
        leaveType: '',
        leaveReason: '',
        otherReason: '',
        beginDate: '',
        endDate: ''
      }
    }
  },
  mounted() {
    this.details()
    this.$title({
      title: this.$route.name
    })
  },
  methods: {
    details() {
      this.$loadingState(true, '数据加载中')
      request
        .post(API.DINGTALK_DUTY_FINDLEAVEONEDUTY, {
          id: this.$route.params.id || ''
        })
        .then(res => {
          this.$loadingState(false)
          let errCode = res.data.errorCode
          let data = res.data.data || {}
          if (errCode) {
            this.form = {
              id: data.id || '',
              leaveType: data.type || '',
              leaveReason: data.reason || '',
              otherReason: data.otherReason || '',
              beginDate: data.stime || '',
              endDate: data.etime || ''
            }
            this.history = data.approvalHistory || []
          } else {
            dAlert(res.data.msg)
          }
        })
        .catch(errr => (this.$loadingState(false)))
    }
  },
  components: {
    ApvHistory
  }
}
</script>
