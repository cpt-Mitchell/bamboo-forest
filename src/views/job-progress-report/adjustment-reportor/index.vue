<!-- 调整作业进度汇报人 -->
<template>
  <div class="logging-progress-reportor-box">
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
                @change="selectChangeHandle('areaName', 'areas', 'forestClasses')"
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
                <option :value="null" selected>请选择林班</option>
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
                <option :value="null" selected>请选择订单编号</option>
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
                @change="selectChangeHandle('procedure', 'workProdures', 'reporters')"
              >
                <!-- formSetProdurceValue -->
                <option :value="null" selected>请选择作业工序</option>
                <option v-for="(option, index) in workProdures" :key="index" :value="option.workPactProcedureId">{{
                  option.procedureName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field class="no-disabled_bgcolor" v-model="form.originalReporter" label="原汇报人" disabled />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>新汇报人</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                v-model="form.reporter"
                :disabled="!form.workPactProcedureId"
                @change="formSetProdurceValue('reporter')"
              >
                <option :value="null" selected>请选择新汇报人</option>
                <option v-for="(option, index) in reporters" :key="index" :value="option.reporter">{{
                  option.reporter
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.startWorkDate"
          @click.native="datePickerShow('startWorkDate')"
          label="执行开始日期"
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
      reporters: [],
      form: {
        workPactProcedureId: null,
        reporter: null,
        forestName: null,
        areaName: null,
        compartment: null,
        orderNo: null,
        procedureName: null,
        projectName: null,
        originalReporter: null,
        startWorkDate: null
      },
      showDatePicker: false
    }
  },
  methods: {
    filterInputSize(size, key) {
      let number = parseFloat(this.form[key]).toFixed(size)
      this.form[key] = number
    },
    formSetProdurceValue(key) {
      let item = {}
      if (key === 'reporter') {
        item = this.reporters.find(item => item.reporter === this.form.reporter)
        if (item) {
          this.form = Object.assign(this.form, { reporter: item.reporter })
        }
      } else {
        item = this.workProdures.find(item => item.workPactProcedureId === this.form.workPactProcedureId)
        if (item) {
          this.form = Object.assign(this.form, item)
        }
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
      this.form.startWorkDate = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'compartment', 'orderNo', 'procedureName', 'reporter']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses', 'orderNumbers', 'workProdures', 'reporters']
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
      if (formKey === 'procedure') {
        this.formSetProdurceValue()
      }
      let params = this.getQueryObject(formKey, arrKey)
      if (!params) return
      this.querySelector(params, nextArrKey)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.FOREST_JOB_REPORTER_QUERY_SELECT_ITEMS, params)
        .then(res => {
          this.$loadingState(false)
          let errorCode = res.data.code
          if (errorCode === 1000) {
            this[nextArrKey] = res.data.data || []
          }
        })
        .then(err => this.$loadingState(false))
    },
    doSubmit() {
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.FOREST_JOB_REPORTER_SAVE, this.form)
          .then(res => {
            let errorCode = res.data.code
            this.$loadingState(false)
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
    this.$title('采伐作业进度汇报')
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 110px;
  input[type='number'] {
    font-size: 0.32rem;
  }
}
</style>
