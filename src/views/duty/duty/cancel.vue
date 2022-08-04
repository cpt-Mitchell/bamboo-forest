<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-field class="no-disabled_bgcolor" v-model="form.dutyType" label="值班类型" disabled/>
      <van-field class="no-disabled_bgcolor" v-model="form.beginDate" label="值班开始时间" disabled/>
      <van-field class="no-disabled_bgcolor" v-model="form.endDate" label="值班结束时间" disabled/>
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
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="submit()"
            :disabled="$store.state.isLoading"
            style="width:100%;height:40px;"
            type="warning"
          >取消值班申请</van-button>
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
        dutyType: '',
        beginDate: '',
        endDate: '',
        reason: ''
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
        .post(API.DINGTALK_DUTY_FINDONEDUTY, {
          id: this.$route.params.id
        })
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode) {
            let data = res.data.data || {}
            this.form = {
              id: data.id,
              beginDate: data.stime,
              endDate: data.etime,
              reason: data.reason,
              dutyType: data.type
            }
          } else {
            this.$router.push({
              name: '值班申请列表'
            })
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    submit() {
      this.$dConfirm('确定取消该申请吗', data => {
        this.$loadingState(true, '正在取消申请')
        request
          .post(API.DINGTALK_DUTY_CANCELDUTY, {
            id: this.form.id
          })
          .then(res => {
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (res.data.errorCode) {
                this.$router.push({
                  name: '值班申请列表'
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
