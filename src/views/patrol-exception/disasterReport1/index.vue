<template>
  <div style="height: 100%">
    <div class="card card-part">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.lbName" @change="getQy(form.lbName)">
                <option value="" selected>请选择林班</option>
                <option
                  v-for="(option,index) in lbList"
                  :key="index"
                  :value="option.lbName"
                >{{option.lbName}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.reportDate"
          @click.native="datePickerShow('reportDate')"
          label="受灾日期"
          placeholder="点击选择受灾日期"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.date"
          @click.native="datePickerShow('date')"
          label="调查日期"
          placeholder="点击选择调查日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>调查级别</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.level">
                <option value="" selected>请选择调查级别</option>
                <option
                  v-for="(option,index) in levelList"
                  :key="index"
                  :value="option.leveName"
                >{{option.leveName}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>受灾区域</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body" @click="showDialog">
              {{form.range || '点击选择林班'}}
              <!-- <select      class="van-field__control" v-model="form.range" >
                <option value selected>请选择受灾区域</option>
                <option
                  v-for="(option,index) in quList"
                  :key="index"
                  :value="option.qyNo"
                >{{option.qyNo}}</option>
              </select>-->
            </div>
          </div>
        </div>
        <van-field v-model="form.qtyDisaster" label="预估受灾数量" placeholder="请输入预估受灾数量" type="number"/>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>单位</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select class="van-field__control" v-model="form.unit">
                <option value="" selected>请选择单位</option>
                <option
                  v-for="(option,index) in unitList"
                  :key="index"
                  :value="option.unit"
                >{{option.unit}}</option>
              </select>
            </div>
          </div>
        </div>
      </van-cell-group>
      <div style="margin:0 auto;text-align:center">
        <div class="images-box1" ref="img-box">
          <div class="mu-paper" v-for="(img,index) in imgUrls" :key="index">
            <div
              class="upload-masker"
              :ref="'upload-masker-'+img.index"
              @click="viewPic([img.url+img.destination])"
            >
              <div class="upload-progress-bar" :id="'bar-'+img.destination"></div>
              <div class="upload-progress-bar-text" :id="'bar-text-'+img.destination"></div>
            </div>
            <img style="height:100%;width:100%;" :src="img.url+img.destination">
            <span class="file-delete" @click="delete_img(index)">x</span>
          </div>
        </div>
      </div>
    </div>
    <date-picker
      :show="showDatePicker"
      type="date"
      @result="getDateResult"
      @close="datePickerClose"
    />
    <m-selector :data="quList" :show="show" @cancel="hideDialog" @submit="getResult"></m-selector>
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
import MSelector from '@/components/MultipleSelector'
import { ImagePreview } from 'vant'

export default {
  name: 'problemreport',
  data() {
    return {
      show: false,
      tableData: [],
      datePickKey: '',
      showDatePicker: false,
      showPictureAction: false,
      form: {
        lbName: '',
        reportDate: '',
        date: '',
        level: '',
        range: '',
        qtyDisaster: '',
        unit: ''
      },
      reportDate: '',
      log_weatherReport_id: '',
      lbList: [],
      levelList: [
        { id: 1, leveName: '林场调查' },
        { id: 2, leveName: '稽核抽查' }
      ],
      quList: [],
      unitList: [
        { id: 1, unit: '亩' },
        { id: 2, unit: '株' },
        { id: 3, unit: '方' }
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
    showDialog() {
      this.show = true
    },
    hideDialog() {
      this.show = false
    },
    getResult(data) {
      // form.range
      let result = []
      data.forEach(item => {
        result.push(item.qyNo)
      })
      this.form.range = result.join(',')
      this.hideDialog()
    },
    viewPic(links) {
      ImagePreview(links)
    },
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
      this.patrolDate = this.currentdate
    },
    dateValidate(val) {
      if (!val && !this.patrolDate) {
        return false
      }
      if (this.patrolDate) {
        // debugger
        let patrolTime = new Date(this.patrolDate.replace(/-/g, '/')).getTime()
        let nowTime = new Date(this.currentdate.replace(/-/g, '/')).getTime()
        if (patrolTime - nowTime > 0) {
          alert('巡山日期不可超过当前日期！')
          return false
        }
      }
      return true
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
      let quLbId = 0

      for (let i = 0; i < this.lbList.length; i++) {
        if (val === this.lbList[i].lbName) {
          this.form.reportDate = this.lbList[i].reportDate
          console.log(this.reportDate)
          quLbId = this.lbList[i].lbId
          this.log_weatherReport_id = this.lbList[i].fdId
        }
      }

      let params = {
        lbId: quLbId
      }

      let url = API.DINGTALK_DISASTERREPORT_GETQYNO
      request.get(url, { params }).then(res => {
        this.quList = res.data.data || []
        console.log(this.quList)
      })
    },
    save() {
      if (!this.form.lbName) {
        this.$dAlert('请输入林班名称')
        return false
      }
      if (!this.form.reportDate) {
        this.$dAlert('请输入受灾日期')
        return false
      }
      if (!this.form.date) {
        this.$dAlert('请输入调查日期')
        return false
      }
      if (!this.form.level) {
        this.$dAlert('请输入调查级别')
        return false
      }
      if (!this.form.range) {
        this.$dAlert('请选择受灾区域')
        return false
      }
      if (!this.form.qtyDisaster) {
        this.$dAlert('请输入预估受灾数量')
        return false
      }
      if (!this.form.unit) {
        this.$dAlert('请选择单位')
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
        date: '',
        level: '',
        range: '',
        qtyDisaster: '',
        unit: ''
      }
    },
    doSubmit() {
      for (let i = 1; i <= this.imgUrls.length; i++) {
        this.form['photo' + i] = this.imgUrls[i - 1].destination
      }
      let params = {
        lbName: this.form.lbName || '',
        disasterDate: this.form.reportDate || '',
        reportDate: this.form.date || '',
        level: this.form.level || '',
        disasterQy: this.form.range || '',
        qtyDisaster: this.form.qtyDisaster || '',
        unit: this.form.unit || '',
        logWeatherreportId: this.log_weatherReport_id || ''
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
    },
    delete_img(i) {
      this.imgUrls.splice(i, 1)
    }
  },
  components: {
    Footbar,
    DatePicker,
    MSelector
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
