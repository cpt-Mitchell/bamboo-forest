<template>
  <div>
    <div class="card card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>请假类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.leaveType">
                <option value="" selected>请选择请假类型</option>
                <option
                  v-for="(option,index) in leaveTypeOPts"
                  :key="index"
                  :value="option.value"
                >{{option.label}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>请假事由</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.leaveReason">
                <option value="" selected>请选择请假类型</option>
                <option
                  v-for="(option,index) in leaveReasonOpts"
                  :key="index"
                  :value="option.value"
                >{{option.label}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          type="textarea"
          v-model="form.otherReason"
          placeholder="请输其他事由"
          label="其他事由"
          rows="1"
          autosize
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.beginDate"
          @click.native="datePickerShow('beginDate')"
          label="请假开始时间"
          placeholder="点击选择请假开始时间"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.endDate"
          @click.native="datePickerShow('endDate')"
          label="请假结束时间"
          placeholder="点击选择请假结束时间"
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
      form: {
        leaveType: '',
        leaveReason: '',
        otherReason: '',
        beginDate: '',
        endDate: ''
      },
      leaveTypeOPts: [
        {
          label: '一般事假',
          value: '一般事假'
        },
        {
          label: '特殊事假',
          value: '特殊事假'
        },
        {
          label: '工伤假',
          value: '工伤假'
        },
        {
          label: '产假',
          value: '产假'
        },
        {
          label: '探亲假',
          value: '探亲假'
        },
        {
          label: '婚假',
          value: '婚假'
        },
        {
          label: '陪产护理假',
          value: '陪产护理假'
        }
      ],
      leaveReasonOpts: [
        {
          label: '参加婚宴',
          value: '参加婚宴'
        },
        {
          label: '考试办证',
          value: '考试办证'
        },
        {
          label: '送子女上学',
          value: '送子女上学'
        },
        {
          label: '探亲',
          value: '探亲'
        },
        {
          label: '身体不适',
          value: '身体不适'
        },
        {
          label: '到车站接人',
          value: '到车站接人'
        },
        {
          label: '护理病人',
          value: '护理病人'
        },
        {
          label: '抢险救灾',
          value: '抢险救灾'
        },
        {
          label: '产检',
          value: '产检'
        },
        {
          label: '交通故障',
          value: '交通故障'
        },
        {
          label: '工伤',
          value: '工伤'
        },
        {
          label: '看病',
          value: '看病'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      showDatePicker: false,
      dateKey: ''
    }
  },
  methods: {
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
      this.dateKey = key
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.dateKey] = parseTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    submit() {
      if (!this.form.leaveType) {
        this.$dAlert('请选择请假类型')
        return false
      }
      if (!this.form.beginDate) {
        this.$dAlert('请选择请假开始时间')
        return false
      }
      if (!this.form.endDate) {
        this.$dAlert('请选择请假结束时间')
        return false
      }
      if (this.form.beginDate === this.form.endDate) {
        this.$dAlert('请假开始世界和结束时间不能相同')
        return false
      }
      if (!this.form.leaveReason) {
        this.$dAlert('请输入请假理由')
        return false
      }
      this.$dConfirm('确认提交吗', () => {
        this.doSubmit()
      })
    },
    resetForm() {
      this.form = {
        leaveType: '',
        leaveReason: '',
        otherReason: '',
        beginDate: '',
        endDate: ''
      }
    },
    doSubmit() {
      let params = {
        type: this.form.leaveType || '',
        stime: this.form.beginDate || '',
        etime: this.form.endDate || '',
        reason: this.form.leaveReason || '',
        otherReason: this.form.otherReason || ''
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DUTY_SUBMITLEAVEDUTY, params)
        .then(res => {
          this.$loadingState(false)
          this.$dAlert(res.data.msg, () => {
            if (res.data.errorCode) {
              this.resetForm()
              this.$router.push({
                name: '请假申请列表'
              })
            }
          })
        })
        .catch(errr => (this.$loadingState(false)))
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  mounted() {
    this.$title(this.$route.name)
  }
}
</script>
