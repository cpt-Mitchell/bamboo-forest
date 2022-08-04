<!-- 木材装运计划通知 -->
<template>
  <div class="timber-transport-plan-box">
    <div style="padding:0 10px;">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>林场名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestries.length == 0"
                v-model="form.forestName"
                @change="selectChangeHandle('forestName', 'forestries', 'areas')"
              >
                <option :value="null" selected>请选择林场</option>
                <option v-for="(option, index) in forestries" :key="index" :value="option.lcName">{{
                  option.lcName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="areas.length == 0"
                v-model="form.areaName"
                @change="selectChangeHandle('areaName', 'areas', 'salesNumbers')"
              >
                <option :value="null" selected>请选择片区</option>
                <option v-for="(option, index) in areas" :key="index" :value="option.pqName">{{
                  option.pqName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>销售合同编号</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="salesNumbers.length == 0"
                v-model="form.salesNumber"
                @change="selectChangeHandle('salesNumber', 'salesNumbers', 'msgGroups')"
              >
                <option :value="null" selected>请选择合同编号</option>
                <option v-for="(option, index) in salesNumbers" :key="index" :value="option.salesNumber">{{
                  option.salesNumber
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field v-model="form.dealer" label="木材经销商" disabled />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.planTransportDate"
          @click.native="datePickerShow('planTransportDate')"
          label="计划拉运日期"
          placeholder="点击选择日期"
          disabled
        />
        <van-field
          type="number"
          v-model="form.planTransportMainWood"
          label="拉运正材数量(方)"
          placeholder="请输入拉运正材数量(方)4位小数"
          @blur="filterInputSize(4, 'planTransportMainWood')"
        />
        <van-field
          type="number"
          v-model="form.planTransportViceWood"
          label="拉运薪材数量(吨)"
          placeholder="请输入拉运薪材数量(吨)2位小数"
          @blur="filterInputSize(2, 'planTransportViceWood')"
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>短信分组名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                v-model="form.msgGroupName"
                :disabled="!form.salesNumber"
                @change="formSetMainObj('msgGroupName')"
              >
                <option :value="null" selected>请选短信分组</option>
                <option v-for="(option, index) in msgGroups" :key="index" :value="option.msgGroupName">{{
                  option.msgGroupName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field v-model="form.msgGroupObj" label="短信接收人" rows="1" autosize type="textarea" disabled />
      </van-cell-group>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <footbar>
      <van-col span="24">
        <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
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
      forestries: [],
      areas: [],
      forestClasses: [],
      salesNumbers: [],
      msgGroups: [],
      form: {
        salesNumber: null,
        forestName: null,
        areaName: null,
        compartment: null,
        msgGroupObj: null,
        msgGroupName: null,
        planTransportMainWood: null,
        planTransportViceWood: null
      },
      showDatePicker: false
    }
  },
  methods: {
    filterInputSize(size, key) {
      let number = parseFloat(this.form[key]).toFixed(size)
      this.form[key] = number
    },
    formSetMainObj(key) {
      if (key) {
        let msgGroupObj = this.msgGroups.find(item => item[key] === this.form[key])
        if (msgGroupObj) {
          let { planTransportMainWood, planTransportViceWood, planTransportDate } = this.form
          this.form = Object.assign(this.form, msgGroupObj, {
            planTransportMainWood,
            planTransportViceWood,
            planTransportDate
          })
        } else {
          this.form.msgGroupObj = null
        }
        return false
      }
      let salesObj = this.salesNumbers.find(item => item.salesNumber === this.form.salesNumber)
      if (salesObj) {
        this.form = Object.assign(this.form, salesObj)
      } else {
        this.form.msgGroupObj = null
        this.form.msgGroupName = null
      }
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.planTransportDate = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'salesNumber', 'msgGroupObj', 'msgGroupObj']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'salesNumbers', 'msgGroupName']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(formKey, arrKey) {
      let arrItemKey = ''
      switch (formKey) {
        case 'forestName':
          this.resetForm(0)
          this.resetDataArr(0)
          arrItemKey = 'lcName'
          break
        case 'areaName':
          this.resetDataArr(1)
          this.resetForm(1)
          arrItemKey = 'pqName'
          break
        case 'salesNumber':
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'salesNumber'
          break
        case 'msgGroupName':
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'msgGroupName'
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    selectChangeHandle(formKey, arrKey, nextArrKey) {
      if (formKey === 'salesNumber') {
        this.formSetMainObj()
      }
      let params = this.getQueryObject(formKey, arrKey)
      if (!params) return
      this.querySelector(params, nextArrKey)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.FOREST_JOB_LODING_APPLY_SELECT_ITEMS, params)
        .then(res => {
          this.$loadingState(false)
          let errorCode = res.data.code
          if (errorCode === 1000) {
            this[nextArrKey] = res.data.data || []
          }
        })
        .catch(err => this.$loadingState(false))
    },
    doSubmit() {
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.FOREST_JOB_LODING_APPLY_SAVE, this.form)
          .then(res => {
            this.$loadingState(false)
            let errorCode = res.data.code
            dAlert(res.data.msg, () => {
              if (errorCode === '1000') {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  mounted() {
    this.querySelector({}, 'forestries')
    this.$title('木材装运通知')
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 110px;
  font-size: 16px;
  input[type='number'] {
    font-size: 0.32rem;
  }
}
</style>
