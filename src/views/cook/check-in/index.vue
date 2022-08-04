<template>
  <div>
    <div class="card card-part">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          v-model="$store.state.appUser.userName"
          label="炊事员"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.dtDate"
          @click.native="datePickerShow('dtDate')"
          label="日期"
          placeholder="点击选择日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>时段</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.period" class="van-field__control">
                <option value="" selected>请选择</option>
                <option
                  v-for="(option,index) in timeQuantum"
                  :key="index"
                  :value="option"
                >{{option}}</option>
              </select>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="doSubmit()"
            :disabled="$store.state.isLoading"
            style="width:100%;height:40px;"
            type="primary"
          >提交申请</van-button>
        </van-col>
      </van-row>
    </footbar>
    <date-picker
      :show="showDatePicker"
      type="date"
      @result="getDateResult"
      @close="datePickerClose"
    />
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      isLoading: false,
      loadingText: '',
      form: {
        dtDate: '',
        period: ''
      },
      timeQuantum: ['上午', '下午', '全天'],
      showDatePicker: false
    }
  },
  mounted() {
    this.$title(this.$route.name)
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
      this.form[this.dateKey] = parseTime(val, '{y}-{m}-{d}')
    },
    doSubmit() {
      if (!this.form.dtDate) {
        this.$dAlert('请选择日期')
        return false
      }
      if (!this.form.period) {
        this.$dAlert('请选择时段')
        return false
      }
      this.form.cookerName = this.$store.state.appUser.userName
      this.$loadingState(true, '数据提交中')
      request
        .post(API.DINGTALK_DUTY_COOKCHECKINADD, this.form)
        .then(res => {
          this.$loadingState(false)
          dAlert(res.data.msg, () => {
            if (res.data.errorCode) {
              this.$router.back()
            }
          })
        })
        .catch(err => (this.$loadingState(false)))
    }
  },
  components: {
    Footbar,
    DatePicker
  }
}
</script>

<style lang="less" scoped>
.option {
  padding: 0px 10px;
}

.form-common-text {
  width: 100%;
  height: 30px;
  line-height: 23px;
  border-bottom-width: 1px;
  border-bottom-color: #a0a8a94d;
  border-bottom-style: solid;
}

.mu-form-item__error {
  .form-common-text {
    border-bottom-color: #f44336;
  }
}
</style>
