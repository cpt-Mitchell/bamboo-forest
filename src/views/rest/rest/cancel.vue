<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="form.beginDate" label="休班开始时间" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.endDate" label="休班结束时间" disabled/>
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
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="submit()"
            :disabled="$store.state.isLoading"
            style="width:100%;height:40px;"
            type="warning"
          >取消休班申请</van-button>
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
        applyDays: '',
        beginDate: '',
        endDate: '',
        remark: ''
      }
    }
  },
  mounted() {
    this.findDetail()
    this.$title('取消休班申请')
  },
  methods: {
    findDetail() {
      this.$loadingState(true, '数据加载中')
      request
        .post(API.DINGTALK_DUTY_FINDOFFONEDUTY, {
          id: this.$route.params.id
        })
        .then(resp => {
          this.$loadingState(false)
          if (resp.data.errorCode) {
            let data = resp.data.data || {}
            this.form = {
              id: data.id,
              beginDate: data.stime,
              endDate: data.etime,
              remark: data.remark
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
          .post(API.DINGTALK_DUTY_CANCELOFFDUTY, {
            id: this.form.id
          })
          .then(res => {
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (res.data.errorCode) {
                this.$router.push({
                  name: '休班申请列表'
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
