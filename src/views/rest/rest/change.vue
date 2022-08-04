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
  name: 'change',
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
    details() {
      this.$loadingState(true, '数据查询中')
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
          } else {
            dAlert(resp.data.msg)
          }
        })
        .catch(errr => (this.isLoading = false))
    },
    getCanRestDays() {
      this.$loadingState(true, '可休天数查询中')
      request
        .post(API.DINGTALK_DUTY_CANRESTDAYS)
        .then(res => {
          this.details()
          let errCode = res.data.errorCode
          if (errCode) {
            this.resetDays = (res.data.data || 0) + '天'
          }
        })
        .catch(errr => {
          this.details()
        })
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
      if (!this.form.id) {
        this.$dAlert('当前数据id不存在，请刷新页面重试')
        return false
      }
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
        id: this.form.id || '',
        stime: this.form.beginDate || '',
        etime: this.form.endDate || '',
        remark: this.form.remark || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DUTY_UPDATEOFFDUTY, params)
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
