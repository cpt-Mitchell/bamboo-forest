<template>
  <div>
    <div class="card card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>值班类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.dutyType">
                <option :value="null" selected>请选择值班类型</option>
                <option
                  v-for="(option,index) in dutyTypeOPts"
                  :key="index"
                  :value="option.value"
                >{{option.label}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.beginDate"
          @click.native="datePickerShow('beginDate')"
          label="值班开始时间"
          placeholder="点击选择值班开始时间"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.endDate"
          @click.native="datePickerShow('endDate')"
          label="值班结束时间"
          placeholder="点击选择值班结束时间"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          type="textarea"
          v-model="form.reason"
          placeholder="请输入值班原因"
          label="值班原因"
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
  data() {
    return {
      form: {},
      dutyTypeOPts: [{
        label: '法定节假日值班',
        value: '法定节假日值班'
      },
      {
        label: '休息日值班',
        value: '休息日值班'
      }
      ],
      showDatePicker: false
    }
  },
  mounted() {
    const that = this
    this.$title(this.$route.name)
    this.$watch('beginDate', () => {
      that.form.beginDate = this.beginDate
    })
    this.$watch('endDate', () => {
      that.form.endDate = this.endDate
    })
    this.details()
  },
  methods: {
    details() {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.DINGTALK_DUTY_FINDONEDUTY, {
          id: this.$route.params.id || ''
        })
        .then(res => {
          this.$loadingState(false)
          let errCode = res.data.errorCode
          let data = res.data.data || {}
          if (errCode) {
            this.form.beginDate = data.stime || ''
            this.form.endDate = data.etime || ''
            this.form.reason = data.reason || ''
            this.form.id = data.id || ''
            this.form.dutyType = data.type || ''
          } else {
            dAlert(res.data.msg)
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
    submit() {
      if (!this.form.dutyType) {
        this.$dAlert('请选择值班类型')
        return false
      }
      if (!this.form.beginDate) {
        this.$dAlert('请选择值班开始时间')
        return false
      }
      if (!this.form.endDate) {
        this.$dAlert('请选择值班结束时间')
        return false
      }
      if (!this.form.reason) {
        this.$dAlert('请输入值班理由')
        return false
      }
      this.$dConfirm('确认提交吗', () => {
        this.doSubmit()
      })
    },
    resetForm() {
      this.beginDate = ''
      this.endDate = ''
      this.form = {
        dutyType: '',
        beginDate: '',
        endDate: '',
        reason: ''
      }
    },
    doSubmit() {
      let that = this
      let params = {
        id: this.form.id,
        type: this.form.dutyType || '',
        stime: this.form.beginDate || '',
        etime: this.form.endDate || '',
        reason: this.form.reason || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DUTY_UPDATEDUTY, params)
        .then(res => {
          this.$loadingState(false)
          let errCode = res.data.errorCode
          dAlert(res.data.msg, () => {
            if (errCode) {
              that.resetForm()
              that.$router.push({
                name: '值班申请列表'
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
