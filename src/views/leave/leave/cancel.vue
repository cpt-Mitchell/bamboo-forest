<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-field class="no-disabled_bgcolor" v-model="form.leaveType" label="请假类别" disabled/>
      <van-field
        class="no-disabled_bgcolor"
        style="color:#333"
        type="textarea"
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
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="submit()"
            :disabled="$store.state.isLoading"
            style="width:100%;height:40px;"
            type="warning"
          >取消请假申请</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
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
    this.findDetail()
    this.$title(this.$route.name)
  },
  methods: {
    findDetail() {
      this.$loadingState(true, '数据加载中')
      request
        .post(API.DINGTALK_DUTY_FINDLEAVEONEDUTY, {
          id: this.$route.params.id
        })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode) {
            let data = res.data.data || {}
            this.form = {
              leaveType: data.type,
              leaveReason: data.reason,
              otherReason: data.otherReason,
              beginDate: data.stime,
              endDate: data.etime,
              id: data.id
            }
          } else {
            this.$router.push({
              name: '请假申请列表'
            })
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    submit() {
      this.$dConfirm('确定取消该申请吗', data => {
        this.$loadingState(true, '正在取消申请')
        request
          .post(API.DINGTALK_DUTY_CANCELLEAVEDUTY, {
            id: this.form.id
          })
          .then(res => {
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (res.data.errorCode) {
                this.$router.push({
                  name: '请假申请列表'
                })
              }
            })
          })
          .catch(err => (this.$loadingState(false)))
      })
    }
  },
  components: {
    Footbar
  }
}
</script>
