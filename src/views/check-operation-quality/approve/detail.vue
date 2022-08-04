<template>
  <div style="height: 100%;">
    <div class="card card-part">
      <van-cell-group>
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.lcName" label="林场名称" disabled />
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.pqName" label="片区名称" disabled />
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.lbName" label="林班名称" disabled />
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.orderNo" label="订单编号" disabled />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          v-model="form.procedureName"
          label="作业工序"
          disabled
        />
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.checkItem" label="验收项目" disabled />
        <van-field class="no-disabled_bgcolor" style="color:#333" v-model="form.qyNo" label="作业区域" disabled />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          v-model="form.howManyTimes"
          label="第几次验收"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.checkDate"
          @click.native="datePickerShow('checkDate')"
          label="验收日期"
          placeholder="点击选择日期"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          style="color:#333"
          type="textarea"
          v-model="form.checkPersonnel"
          placeholder="点击选择验收人员"
          label="验收人员"
          disabled
          rows="1"
          autosize
          @click.native="pickerDisplay = true"
        />
      </van-cell-group>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <check-user-picker
      v-if="form.lcId"
      :display="pickerDisplay"
      @close="closePicker"
      @result="getPickerResult"
      :lcId="form.lcId"
      :limit="2"
      :selected="checkPersonnel"
    ></check-user-picker>
    <footbar>
      <van-row>
        <van-col span="24">
          <van-button
            @click="submit()"
            :disabled="$store.state.isLoading"
            style="width:100%;height:40px;"
            type="primary"
            >提交</van-button
          >
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import CheckUserPicker from '../components/check-user-picker'
import { parseTime } from '@/utils/index'
import { API } from '@/api'
export default {
  data() {
    return {
      pickerDisplay: false,
      showDatePicker: false,
      checkPersonnel: [],
      form: {
        checkDate: ''
      }
    }
  },
  methods: {
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.checkDate = parseTime(val, '{y}-{m}-{d}')
    },
    closePicker() {
      this.pickerDisplay = false
    },
    getPickerResult({ users, ids }) {
      this.checkPersonnel = [].concat(users)
      this.form.checkPersonnel = users.map(item => item.username).join(',')
    },
    getDetailById() {
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_QUALITY_VERIFY_QUERY_BY_ID + this.$route.params.id)
        .then(res => {
          this.$loadingState(false)
          if (res.data.errorCode) {
            this.form = res.data.data
          } else {
            dAlert(res.data.msg)
          }
        })
        .catch(err => {
          this.$loadingState(false)
        })
    },
    submit() {
      if (!this.form.checkDate) {
        this.$dAlert('请选择验收日期')
        return false
      }
      if (!this.form.checkPersonnel) {
        this.$dAlert('请选择验收人员')
        return false
      }
      this.$dConfirm('确认提交吗', () => {
        this.doSubmit()
      })
    },
    doSubmit() {
      this.$loadingState(true, '数据提交中')
      this.form.status = 1
      request
        .post(API.DINGTALK_QUALITY_VERIFY_SAVE, this.form)
        .then(res => {
          this.$loadingState(false)
          this.$dAlert(res.data.msg, () => {
            if (res.data.code === '1000') {
              this.$router.back()
            }
          })
        })
        .catch(err => {
          this.$loadingState(false)
        })
    }
  },
  components: {
    Footbar,
    CheckUserPicker,
    DatePicker
  },
  mounted() {
    this.getDetailById()
    this.$title('验收区域审核表')
  }
}
</script>
