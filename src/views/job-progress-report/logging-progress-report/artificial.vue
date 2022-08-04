<!-- 采伐作业进度汇报-人工采伐 -->
<template>
  <div class="logging-progress-report-box">
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
                @change="formSetProdurceValue"
              >
                <option :value="null" selected>请选择作业工序</option>
                <option v-for="(option, index) in workProdures" :key="index" :value="option.workPactProcedureId">{{
                  option.procedureName
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.workDate"
          @click.native="datePickerShow('workDate')"
          label="作业日期"
          placeholder="点击选择日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>天气</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                v-model="form.weather"
                :disabled="!form.workPactProcedureId"
              >
                <option :value="null" selected>请选择天气</option>
                <option v-for="(option, index) in ['晴天或阴天', '小雨', '大雨']" :key="index" :value="option">{{
                  option
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          type="number"
          v-model="form.realPerson"
          label="民工人数"
          placeholder="请输入民工人数"
          @blur="filterInputSize(0, 'realPerson')"
        />
        <van-field
          type="number"
          v-model="form.todayJoinPerson"
          label="当天投入总工数"
          placeholder="请输入当天投入总工数"
          @blur="filterInputSize(1, 'todayJoinPersons')"
        />
        <van-field
          type="number"
          v-model="form.todayJoinCarPerson"
          label="当天装车投入工数"
          placeholder="请输入当天装车投入工数数"
          @blur="filterInputSize(1, 'todayJoinCarPerson')"
        />
        <van-field
          type="number"
          v-model="form.transportMainWood"
          label="拉运正材数量(方)"
          placeholder="请输入拉运正材数量(方)4位小数"
          @blur="filterInputSize(4, 'transportMainWood')"
        />
        <van-field
          type="number"
          v-model="form.transportViceWood"
          label="拉运薪材数量(吨)"
          placeholder="请输入拉运薪材数量(吨)2位小数"
          @blur="filterInputSize(2, 'transportViceWood')"
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>影响拉运计划原因</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.reason">
                <option :value="null" selected>请选择影响原因</option>
                <option
                  v-for="(option, index) in [
                    '雨天路滑',
                    '道路塌方',
                    '经销商贷款不足',
                    '经销商派车不足',
                    '道路硬化',
                    '纠纷受阻',
                    '运输证不足',
                    '库存不足',
                    '其他'
                  ]"
                  :key="index"
                  :value="option"
                  >{{ option }}</option
                >
              </select>
            </div>
          </div>
        </div>
        <van-field
          v-model="form.otherReason"
          v-if="form.reason === '其他'"
          label="其他原因"
          placeholder="请输入其他原因"
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
        workPactProcedureId: null,
        forestName: null,
        areaName: null,
        compartment: null,
        orderNo: null,
        procedureName: null,
        projectName: null,
        weather: null,
        realPerson: null,
        todayJoinPerson: null,
        woodReason: null,
        reason: null,
        otherReason: '',
        transportMainWood: null,
        todayJoinCarPerson: null,
        transportViceWood: null
      },
      showDatePicker: false
    }
  },
  methods: {
    filterInputSize(size, key) {
      let number = parseFloat(this.form[key]).toFixed(size)
      this.form[key] = number
    },
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
      this.form.workDate = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'compartment', 'orderNo', 'procedureName']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
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
      request.post(API.FOREST_JOB_FELLING_QUERY_SELECT_ITEMS, params).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.code
        if (errorCode === 1000) {
          this[nextArrKey] = res.data.data || []
        }
      })
    },
    doSubmit() {
      let reason = this.form.reason === '其他' ? this.form.otherReason : this.form.reason
      // 正材必须填写当天拉运量
      let produreItem = this.workProdures.find(item => item.workPactProcedureId === this.form.workPactProcedureId)

      if (
        produreItem.procedureName === '采伐:正材' &&
        Number.parseFloat(this.form.transportMainWood || 0) === 0 &&
        !reason
      ) {
        this.$dAlert('当天拉运量为0，影响拉运计划原因必需选择')
        return false
      } else if (produreItem.procedureName === '采伐:薪材') {
        this.form.transportMainWood = 0
      }
      this.form.woodReason = reason
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.FOREST_JOB_FELLING_SAVE, this.form)
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
    this.$title('采伐作业进度汇报')
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
