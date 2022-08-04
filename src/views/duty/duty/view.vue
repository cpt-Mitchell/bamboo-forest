<template>
  <div>
    <div class="card card-part">
      <van-field class="no-disabled_bgcolor" v-model="form.dutyType" label="值班类型" disabled/>
      <van-field class="no-disabled_bgcolor" v-model="beginDate" label="值班开始时间" disabled/>
      <van-field class="no-disabled_bgcolor" v-model="endDate" label="值班结束时间" disabled/>
      <van-field
        type="textarea"
        class="no-disabled_bgcolor"
        v-model="form.reason"
        label="值班原因"
        rows="1"
        autosize
        disabled
      />
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
      form: {},
      beginDate: '',
      endDate: ''
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
        .post(API.DINGTALK_DUTY_FINDONEDUTY, {
          id: this.$route.params.id || ''
        })
        .then(resp => {
          this.$loadingState(false)
          let errCode = resp.data.errorCode
          let data = resp.data.data || {}
          if (errCode) {
            this.beginDate = data.stime || ''
            this.endDate = data.etime || ''
            this.form.reason = data.reason || ''
            this.form.id = data.id || ''
            this.form.dutyType = data.type || ''
            this.history = data.approvalHistory || []
          } else {
            dAlert(resp.data.msg)
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
