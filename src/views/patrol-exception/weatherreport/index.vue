<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title van-field__label">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.lbName">
                <option value selected>请选择林班</option>
                <option v-for="(option, index) in lbList" :key="index" :value="option.lbName">{{
                  option.lbName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.reportDate"
          @click.native="datePickerShow('reportDate')"
          label="日期"
          placeholder="点击选择日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title van-field__label">
            <span>天气</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.weather">
                <option value selected>请选择天气</option>
                <option v-for="(option, index) in weatherTypeList" :key="index" :value="option.weatherTypeName">{{
                  option.weatherTypeName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(81, 51, 51);">
          <div class="van-cell__title van-field__label">
            <span>气温</span>
          </div>
          <van-field
            v-model="form.temperatureMin"
            style="max-width:110px;padding:5px;"
            placeholder="请输入气温"
            size="small"
            type="number"
          />
          <div class="van-cell__title" style="max-width:15px;text-align:center">
            <span>-</span>
          </div>
          <van-field v-model="form.temperatureMax" style="max-width:110px;padding:5px;" type="number" />
          <div class="van-cell__title" style="max-width:20px;">
            <span>℃</span>
          </div>
        </div>
        <van-field v-model="form.rainfall" label="降雨量" placeholder="请输入降雨量" type="number" />
      </van-cell-group>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <footbar>
      <van-col span="24">
        <van-button @click="save()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker'
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'

export default {
  name: 'problemreport',
  data() {
    return {
      tableData: [],
      datePickKey: '',
      showDatePicker: false,
      showPictureAction: false,
      form: {
        lbName: '',
        reportDate: '',
        weather: '',
        temperatureMin: '',
        temperatureMax: '',
        rainfall: ''
      },
      patrolDate: '',
      lbList: [],
      weatherTypeList: [
        { id: 1, weatherTypeName: '晴' },
        { id: 2, weatherTypeName: '小雨' },
        { id: 3, weatherTypeName: '大雨' },
        { id: 4, weatherTypeName: '暴雨' },
        { id: 5, weatherTypeName: '特大暴雨' },
        { id: 6, weatherTypeName: '台风' },
        { id: 7, weatherTypeName: '大雪' }
      ],
      imgUrls: [],
      currentdate: ''
    }
  },
  mounted() {
    this.initPage()
    this.$title(this.$route.name)
  },
  methods: {
    datePickerClose() {
      this.showDatePicker = false
      this.datePickKey = ''
    },
    datePickerShow(key) {
      this.datePickKey = key
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.datePickKey] = parseTime(val, '{y}-{m}-{d}')
    },
    initPage() {
      this.findLb()
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.currentdate = year + '-' + month + '-' + strDate
      this.reportDate = this.currentdate
    },
    dateValidate(val) {
      if (!val && !this.reportDate) {
        return false
      }
      if (this.reportDate) {
        // debugger
        let patrolTime = new Date(this.reportDate.replace(/-/g, '/')).getTime()
        let nowTime = new Date(this.currentdate.replace(/-/g, '/')).getTime()
        if (patrolTime - nowTime > 0) {
          alert('日期不可超过当前日期！')
          return false
        }
      }
      return true
    },
    findLb() {
      let that = this
      let url = API.DINGTALK_FORESTRY_EXCEPTION_FINDLB
      request
        .get(url)
        .then(res => {
          that.lbList = res.data.data || []
        })
        .catch(e => {
          this.$dAlert(e.msg || '获取林班异常')
        })
    },
    save() {
      if (!this.form.lbName) {
        this.$dAlert('请输入林班名称')
        return false
      }
      if (!this.form.reportDate) {
        this.$dAlert('请输入日期')
        return false
      }
      if (!this.form.weather) {
        this.$dAlert('请选择天气')
        return false
      }
      if (!this.form.temperatureMin) {
        this.$dAlert('请输入气温')
        return false
      }
      if (!this.form.temperatureMax) {
        this.$dAlert('请输入气温')
        return false
      }
      if (!this.form.rainfall) {
        this.$dAlert('请输入降雨量')
        return false
      }

      this.$dConfirm('确认提交当前信息吗？', () => {
        this.doSubmit()
      })
    },
    resetForm() {
      this.form = {
        lbName: '',
        reportDate: '',
        weather: '',
        temperatureMin: '',
        temperatureMax: '',
        rainfall: ''
      }
    },
    doSubmit() {
      // debugger
      let params = {
        lbName: this.form.lbName || '',
        reportDate: this.form.reportDate || '',
        weather: this.form.weather || '',
        temperature: this.form.temperatureMin + '/' + this.form.temperatureMax || '',
        rainfall: this.form.rainfall || ''
      }
      this.$loadingState(true, '数据提交中')
      var par = []
      par.push(params)
      request
        .post(API.DINGTALK_WEATHERREPORT_SAVE, par)
        .then(res => {
          this.$loadingState(false)
          if (res.data) {
            this.tableData = res.data || []
            this.resetForm()
            this.$router.back()
          }
        })
        .catch(err => this.$loadingState(false))
    },
    delete_img(i) {
      this.imgUrls.splice(i, 1)
    }
  },
  components: {
    Footbar,
    DatePicker
  }
}
</script>
<style lang="less" scoped>
.images-box {
  width: 100%;
  display: flex;
  // flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;

  .van-field__label {
    max-width: 110px;
  }

  //   .van-cell__title
  //   {
  //     max-width: 120px;
  // }

  .mu-paper {
    width: 2.2rem;
    height: 2rem;
    // margin-right: 0.31rem;
    // margin-bottom: 0.31rem;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.add-btn-paper {
      line-height: 2rem;
      // text-align: center;
      // font-size: 0.8rem;
      color: #000;
      position: relative;

      input[type='file'] {
        font-size: 0;
        opacity: 0;
        width: 100%;
        filter: alpha(opacity=0);
        position: absolute;
        height: 100%;
        right: 0;
        top: 1px;
        cursor: pointer;
      }
    }
  }
}
.images-box1 {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 15px;

  .mu-paper {
    width: 2rem;
    height: 2rem;
    margin-right: 0.31rem;
    margin-bottom: 0.31rem;
    text-align: center;
    position: relative;

    &:nth-child(4n) {
      margin-right: 0;
    }

    &.add-btn-paper {
      line-height: 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: #888;
      position: relative;

      input[type='file'] {
        font-size: 0;
        opacity: 0;
        width: 100%;
        filter: alpha(opacity=0);
        position: absolute;
        height: 100%;
        right: 0;
        top: 1px;
        cursor: pointer;
      }
    }

    .file-delete {
      position: absolute;
      right: -5px;
      top: -5px;
      background: #f44333;
      border-radius: 50%;
      color: #fff;
      width: 15px;
      height: 15px;
      line-height: 13px;
      display: inline-block;
      font-size: 11px;
    }
  }
}

.upload-masker {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  // justify-content: center;
  align-items: center;

  .upload-progress-bar {
    width: 0;
    height: 5px;
    background: #61affe;
    border-radius: 3px;
    transition: width 0.2s ease-in;
  }

  .upload-progress-bar-text {
    font-size: 0.32rem;
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;

    // margin-top:0px;
    &.error {
      color: #f44333;
    }
  }
}
#container {
  width: 100%;
  height: 200px;
}

.option {
  padding: 0px 5px;
}
</style>
