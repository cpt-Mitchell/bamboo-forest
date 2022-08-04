<template>
  <div class="logging-complete-container">
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
                <option value selected>请选择林场</option>
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
                @change="selectChangeHandle('areaName', 'areas', 'forestClasses')"
              >
                <option value selected>请选择片区</option>
                <option v-for="(option, index) in areas" :key="index" :value="option.pqName">{{
                  option.pqName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestClasses.length == 0"
                v-model="form.compartment"
                @change="selectChangeHandle('compartment', 'forestClasses', 'orderNumbers')"
              >
                <option value selected>请选择林班</option>
                <option v-for="(option, index) in forestClasses" :key="index" :value="option.lbName">{{
                  option.lbName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>订单编号</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="orderNumbers.length == 0"
                v-model="form.orderNo"
                @change="selectChangeHandle('orderNo', 'orderNumbers', 'workProdures')"
              >
                <option value selected>请选择订单编号</option>
                <option v-for="(option, index) in orderNumbers" :key="index" :value="option.orderNo">{{
                  option.orderNo
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>作业工序</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="workProdures.length == 0"
                v-model="form.workPactProcedureId"
                @change="formSetProdurceValue"
              >
                <option value="" selected>请选择作业工序</option>
                <option v-for="(option, index) in workProdures" :key="index" :value="option.workPactProcedureId">{{
                  option.procedureName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.cutEndDate"
          @click.native="datePickerShow('cutEndDate')"
          label="采伐完工日期"
          placeholder="点击选择日期"
          disabled
        />
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
      orderNumbers: [],
      workProdures: [],
      form: {
        workPactProcedureId: '',
        forestName: '',
        areaName: '',
        compartment: '',
        orderNo: '',
        procedureName: '',
        projectName: ''
      },
      showDatePicker: false
    }
  },
  methods: {
    formSetProdurceValue() {
      let produreItem = this.workProdures.find(item => item.workPactProcedureId === this.form.workPactProcedureId)
      if (produreItem) {
        // this.form.procedureName = produreItem.procedureName
        this.form = Object.assign(this.form, produreItem)
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
      this.form.cutEndDate = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'compartment', 'orderNo', 'procedureName']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = ''
      })
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses', 'orderNumbers', 'workProdures']
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
        case 'compartment':
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'lbName'
          break
        case 'orderNo':
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'orderNo'
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    selectChangeHandle(formKey, arrKey, nextArrKey) {
      let params = this.getQueryObject(formKey, arrKey)
      if (!params) return
      this.querySelector(params, nextArrKey)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.FOREST_JOB_APPLY_CUT_OVER_QUERY_SELECT_ITEMS, params)
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
          .post(API.FOREST_JOB_APPLY_CUT_OVER_SAVE, this.form)
          .then(res => {
            this.$loadingState(false)
            let errorCode = res.data.code
            this.$dAlert(res.data.msg, () => {
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
    this.$title('作业完工汇报')
  }
}
</script>

<style lang="less">
.logging-complete-container {
  .van-field .van-cell__title {
    max-width: 110px;
  }
  .van-field__body input {
    margin-left: 10px;
  }
}
</style>
