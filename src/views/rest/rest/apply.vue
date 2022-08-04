<template>
  <div>
    <div class="card card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" v-model="resetDays" label="可休班天数" disabled/>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.beginDate"
          @click.native="datePickerShow('beginDate')"
          label="休班开始时间"
          placeholder="选择休班开始时间"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.endDate"
          @click.native="datePickerShow('endDate')"
          label="休班结束时间"
          placeholder="选择休班结束时间"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          type="textarea"
          v-model="form.remark"
          placeholder="请输入备注"
          label="备注"
          rows="1"
          autosize
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
            type="primary"
          >提交申请</van-button>
        </van-col>
      </van-row>
    </footbar>
    <date-picker
      :show="showDatePicker"
      type="datetime"
      @result="getDateResult"
      @close="datePickerClose"
    />
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import { parseTime } from '@/utils/index'
import { API } from '@/api'
export default {
  name: 'apply',
  data() {
    return {
      resetDays: 0,
      form: {},
      showDatePicker: false,
      dateKey: ''
    }
  },
  mounted() {
    this.$title(this.$route.name)
    this.getCanRestDays()
  },
  methods: {
    getCanRestDays() {
      this.$loadingState(true, '可休天数查询中')
      request
        .post(API.DINGTALK_DUTY_CANRESTDAYS)
        .then(res => {
          this.$loadingState(false)
          let errCode = res.data.errorCode
          if (!errCode || res.data.data <= 0) {
            // dd.device.notification.alert({
            //   message: errCode ? '可休天数为' + res.data.data + '!' : res.data.msg,
            //   title: '提示',
            //   buttonName: '确定',
            //   onSuccess: function() {
            //     if (errCode) {
            //       if (res.data.data <= 0) {
            //         that.$router.back();
            //       }
            //     }
            //   }
            // });
            dAlert(
              errCode ? '可休天数为' + res.data.data + '!' : res.data.msg,
              () => {
                if (errCode) {
                  if (res.data.data <= 0) {
                    that.$router.back()
                  }
                }
              }
            )
          } else {
            this.resetDays = (res.data.data || 0) + '天'
          }
        })
        .catch(errr => (this.$loadingState(false)))
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
      this.dateKey = key
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.dateKey] = parseTime(val, '{y}-{m}-{d} {h}:{i}')
    },
    resetForm() {
      this.form = {
        beginDate: '',
        endDate: '',
        remark: ''
      }
    },
    submit() {
      if (!this.form.beginDate) {
        this.$dAlert('请选择休班开始时间')
        return false
      }
      if (!this.form.endDate) {
        this.$dAlert('请选择休班结束时间')
        return false
      }
      if (!this.form.remark) {
        this.$dAlert('请输入备注')
        return false
      }
      this.$dConfirm('确认提交吗', () => {
        this.doSubmit()
      })
    },
    doSubmit() {
      let that = this
      let params = {
        stime: this.form.beginDate || '',
        etime: this.form.endDate || '',
        remark: this.form.remark || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DUTY_SUBMITOFFDUTY, params)
        .then(res => {
          this.$loadingState(false)
          let errCode = res.data.errorCode
          dAlert(res.data.msg, () => {
            if (errCode) {
              that.resetForm()
              that.$emit('doneSubmit', {
                done: true
              })
            }
          })
          if (res.data) {
            this.dutyList = res.data || []
          }
        })
        .catch(errr => (this.$loadingState(false)))
    }
  },
  components: {
    Footbar,
    DatePicker
  }
}
</script>
