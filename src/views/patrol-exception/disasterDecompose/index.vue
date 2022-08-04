<template>
  <div style="height: 100%">
    <div class="card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.lbName" @change="getQy(form.lbName)">
                <option value selected>请选择林班</option>
                <option
                  v-for="(option,index) in lbList"
                  :key="index"
                  :value="option.fdId"
                >{{option.lbName}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field class="no-disabled_bgcolor" v-model="form.lbPeriod" label="林班属期" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.disasterDate" label="受灾日期" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.weather" label="天气" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.temperature" label="气温" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.rainfall" label="降雨量" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.wind" label="风力" disabled/>
        <van-field class="no-disabled_bgcolor" v-model="form.disaster" label="可能出现的灾害" disabled/>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title van-field__label">
            <span>核查人</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.checkerId">
                <option value selected>请选择核查人</option>
                <option
                  v-for="(option,index) in checkerList"
                  :key="index"
                  :value="option.employeeNo"
                >{{option.username}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.checkTime"
          @click.native="datePickerShow('checkTime')"
          label="核查完成日期"
          placeholder="点击选择日期"
          disabled
        />
      </van-cell-group>
      <date-picker
        :show="showDatePicker"
        type="date"
        @result="getDateResult"
        @close="datePickerClose"
      />
    </div>
    <footbar>
      <van-col span="24">
        <van-button @click="save()" style="width:100%;height:40px;" type="primary">任务安排</van-button>
      </van-col>
    </footbar>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker'
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { ImagePreview } from 'vant'
import { parseTime } from '@/utils/index'

export default {
  name: 'exceptionaudit',
  data() {
    return {
      showDatePicker: false,
      weatherTypeList: [],
      tableData: [],
      weathertableData: [],
      remark1: '',
      files: [],
      checkerList: [],
      lbList: [],
      form: {
        checker: '',
        checkerId: '',
        lbPeriod: '',
        disasterDate: '',
        temperature: '',
        disaster: '',
        weather: '',
        rainfall: '',
        wind: '',
        fdId: '',
        ranger: '',
        lbName: '',
        lbName1: '',
        patrolDate: '',
        problemType: '',
        remark1: '',
        auditer1: '',
        auditTime1: '',
        reportDate: '',
        checkTime: ''
      }
    }
  },
  watch: {},
  mounted() {
    this.initPage()
    this.$title(this.$route.name)
  },
  methods: {
    initPage() {
      this.findLb()
    },
    resetForm() {
      this.form = {
        checker: '',
        lbPeriod: '',
        disasterDate: '',
        temperature: '',
        disaster: '',
        weather: '',
        rainfall: '',
        wind: '',
        fdId: '',
        ranger: '',
        lbName: '',
        lbName1: '',
        patrolDate: '',
        problemType: '',
        remark1: '',
        auditer1: '',
        auditTime1: '',
        reportDate: ''
      }
    },
    findLb() {
      let that = this
      let url = API.DINGTALK_DISASTERREPORT_GETDISSALB
      request.get(url).then(res => {
        that.lbList = res.data.data || []
      }).catch(e => {
        this.$dAlert(e)
      })
    },
    getQy(val) {
      for (let i = 0; i < this.lbList.length; i++) {
        if (val === this.lbList[i].fdId) {
          this.form.lbPeriod = this.lbList[i].lbPeriod
          this.form.disasterDate = this.lbList[i].reportDate
          this.form.temperature = this.lbList[i].temperature
          this.form.weather = this.lbList[i].weather
          this.form.rainfall = this.lbList[i].rainfall
          this.form.disaster = this.lbList[i].disaster
          this.form.wind = this.lbList[i].wind
          this.form.fdId = this.lbList[i].fdId
          this.form.lbName1 = this.lbList[i].lbName

          this.findChecker(this.lbList[i].lcName)
        }
      }
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.datePickKey] = parseTime(val, '{y}-{m}-{d}')
    },
    datePickerShow(key) {
      this.datePickKey = key
      this.showDatePicker = true
    },
    datePickerClose() {
      this.showDatePicker = false
      this.datePickKey = ''
    },
    exceptionDetail(val) {
      let url = API.DINGTALK_DISASTERREPORT_FINDONE
      let params = {
        fdId: val
      }
      this.$loadingState(true, '数据加载中')
      request
        .get(url, { params })
        .then(res => {
          this.$loadingState(false)
          this.tableData = res.data.data || []
          if (this.tableData) {
            this.weatherDetail(this.tableData.logWeatherreportId)
            this.findChecker(this.tableData.lcName)
          }
          // console.log(tableData.logWeatherreportId)
          // weatherDetail(tableData.logWeatherreportId)
        })
        .catch(err => (this.$loadingState(false)))
    },
    weatherDetail(WeatherreportId) {
      let url = API.DINGTALK_WEATHERREPORT_FINDONE
      let params = {
        fdId: WeatherreportId
      }
      this.$loadingState(true, '数据加载中')
      request
        .get(url, { params })
        .then(res => {
          this.$loadingState(false)
          this.weathertableData = res.data.data || []
        })
        .catch(err => (this.$loadingState(false)))
    },
    findChecker(lcName) {
      let that = this
      let url = API.DINGTALK_WEATHERREPORT_FINDAllBYLCNAME + '?lcName=' + lcName
      request
        .get(url)
        .then(res => {
          that.checkerList = res.data.data || []
        })
        .catch(e => {
          this.$dAlert(e)
        })
    },
    watchFile() {
      if (this.files.length === 0) return false
      ImagePreview(this.files)
    },
    save() {
      if (!this.form.checkerId) {
        this.$dAlert('请输入核查人')
        return false
      }
      if (!this.form.checkTime) {
        this.$dAlert('请输入核查完成日期')
        return false
      }

      this.$dConfirm('确认提交当前数据吗', () => {
        this.doSubmit()
      })
    },
    doSubmit() {
      for (let i = 0; i < this.checkerList.length; i++) {
        if (this.form.checkerId === this.checkerList[i].employeeNo) {
          this.form.checker = this.checkerList[i].username
          break
        }
      }
      let params = {
        lbName: this.form.lbName1 || '',
        disasterDate: this.form.disasterDate || '',
        reportDate: this.form.checkTime || '',
        level: '林场调查' || '',
        disasterQy: '' || '',
        qtyDisaster: '0' || '',
        unit: '无' || '',
        logWeatherreportId: this.form.fdId || '',
        checkerId: this.form.checkerId || '',
        checker: this.form.checker
        // checkTime: this.form.checkTime || '',
      }
      this.$loadingState(true, '数据提交中')
      request.post(API.DINGTALK_DISASTERREPORT_SAVE, params).then(res => {
        this.$loadingState(false)
        if (res.data) {
          this.tableData = res.data || []
          this.resetForm()
          this.$router.back()
        }
      }).catch(err => (this.$loadingState(false)))
    }
  },
  components: {
    Footbar,
    DatePicker
  }
}
</script>
<style scoped>
.detail-row {
  padding: 0px 10px;
}

.detail-row div {
  font-size: 13px;
}
.info-row {
  padding: 0px 10px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.label-content {
  word-wrap: break-word;
  border-left-width: 0px;
  border-left-style: dashed;
  border-left-color: rgba(0, 0, 0, 0.1);
}
.card-body {
  padding: 5px 5px;
  background-color: #ffffff;
  border-bottom-width: 0px;
  border-bottom-style: dashed;
  border-bottom-color: rgba(0, 0, 0, 0.21);
  border-radius: 5px;
  line-height: 40px;
}
</style>
