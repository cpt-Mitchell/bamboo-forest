<template>
  <div>
    <div class="card card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="form.canrestDays" label="可休班天数" disabled />
        <van-field class="no-disabled_bgcolor" v-model="form.beginDate" label="休班开始时间" disabled />
        <van-field class="no-disabled_bgcolor" v-model="form.endDate" label="休班结束时间" disabled />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          type="textarea"
          v-model="form.remark"
          placeholder="请输入备注"
          label="备注"
          rows="1"
          autosize
          disabled
        />
      </van-cell-group>
    </div>
    <div class="sub-head">
      <van-row>
        <van-col>
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
        canrestDays: 0,
        beginDate: '',
        endDate: '',
        reason: ''
      }
    }
  },
  mounted() {
    this.getCanRestDays()
    this.details()
    this.$title(this.$route.name)
  },
  methods: {
    getCanRestDays() {
      request.post(API.DINGTALK_DUTY_CANRESTDAYS).then(resp => {
        let errCode = resp.data.errorCode
        if (errCode) {
          this.form.canrestDays = resp.data.data + '天'
        }
      })
    },
    details() {
      this.$loadingState(true, '数据加载中')
      request
        .post(API.DINGTALK_DUTY_FINDOFFONEDUTY, {
          id: this.$route.params.id || ''
        })
        .then(resp => {
          this.$loadingState(false)
          let errCode = resp.data.errorCode
          let data = resp.data.data || {}
          if (errCode) {
            this.form.beginDate = data.stime || ''
            this.form.endDate = data.etime || ''
            this.form.remark = data.remark || ''
            this.form.id = data.id || ''
            this.history = data.approvalHistory || []
          } else {
            dAlert(resp.data.msg)
          }
        })
        .catch(errr => this.$loadingState(false))
    }
  },
  components: {
    ApvHistory
  }
}
</script>
