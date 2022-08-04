<template>
  <div>
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
                @change="selectChangeHandle('forestName','forestries','areas')"
              >
                <option value selected>请选择林场</option>
                <option
                  v-for="(option,index) in forestries"
                  :key="index"
                  :value="option.lcName"
                >{{option.lcName}}</option>
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
                @change="selectChangeHandle('areaName','areas','forestClasses')"
              >
                <option value selected>请选择片区</option>
                <option
                  v-for="(option,index) in areas"
                  :key="index"
                  :value="option.pqName"
                >{{option.pqName}}</option>
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
                @change="selectChangeHandle('compartment','forestClasses','orderNumbers')"
              >
                <option value selected>请选择林班</option>
                <option
                  v-for="(option,index) in forestClasses"
                  :key="index"
                  :value="option.lbName"
                >{{option.lbName}}</option>
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
                @change="selectChangeHandle('orderNo','orderNumbers','workProducres')"
              >
                <option value selected>请选择订单编号</option>
                <option
                  v-for="(option,index) in orderNumbers"
                  :key="index"
                  :value="option.orderNo"
                >{{option.orderNo}}</option>
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
                :disabled="workProducres.length == 0"
                v-model="form.procedure"
                @change="selectChangeHandle('procedure','workProducres','chekProjects')"
              >
                <option value selected>请选择作业工序</option>
                <option
                  v-for="(option,index) in workProducres"
                  :key="index"
                  :value="option.procedureName"
                >{{option.procedureName}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>验收项目</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="chekProjects.length == 0"
                v-model="form.projectName"
                @change="selectChangeHandle('projectName','chekProjects','workAreas')"
              >
                <option value selected>请选择验收项目</option>
                <option
                  v-for="(option,index) in chekProjects"
                  :key="index"
                  :value="option.checkItem"
                >{{option.checkItem}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>作业区域</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="workAreas.length == 0"
                v-model="form.workArea"
                @change="selectChangeHandle('workArea','workAreas','checkTimes')"
              >
                <option value selected>请选择作业区域</option>
                <option
                  v-for="(option,index) in workAreas"
                  :key="index"
                  :value="option.qyNo"
                >{{option.qyNo}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>第几次验收</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="!form.workArea"
                v-model="form.whichTime"
                @change="fillSubmitData"
              >
                <option value selected>请选择第几次验收</option>
                <option v-for="(option,index) in checkTimes" :key="index" :value="option">{{option}}</option>
              </select>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>

    <footbar>
      <van-col span="24">
        <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      forestries: [],
      areas: [],
      forestClasses: [],
      orderNumbers: [],
      workProducres: [],
      chekProjects: [],
      workAreas: [],
      checkTimes: ['1', '2'],
      form: {
        forestName: '',
        areaName: '',
        compartment: '',
        orderNo: '',
        procedure: '',
        projectName: '',
        workArea: '',
        whichTime: ''
      },
      submitData: {},
      requireRule: [
        {
          validate: val => !!val,
          message: ' '
        }
      ]
    }
  },
  methods: {
    resetForm(index) {
      let formItemNames = ['areaName', 'compartment', 'orderNo', 'procedure', 'projectName', 'workArea', 'whichTime']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = ''
      })
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses', 'orderNumbers', 'workProducres', 'chekProjects', 'workAreas']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(formKey, arrKey) {
      let arrItemKey = ''
      switch (formKey) {
        case 'forestName':
          this.submitData = {}
          this.resetForm(0)
          this.resetDataArr(0)
          arrItemKey = 'lcName'
          break
        case 'areaName':
          this.submitData = {}
          this.resetDataArr(1)
          this.resetForm(1)
          arrItemKey = 'pqName'
          break
        case 'compartment':
          this.submitData = {}
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'lbName'
          break
        case 'orderNo':
          this.submitData = {}
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'orderNo'
          break
        case 'procedure':
          this.submitData = {}
          this.resetDataArr(4)
          this.resetForm(4)
          arrItemKey = 'procedureName'
          break
        case 'projectName':
          this.resetForm(5)
          arrItemKey = 'checkItem'
          break
        case 'workArea':
          arrItemKey = 'qyNo'
          this.resetForm(6)
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    fillSubmitData() {
      this.submitData = Object.assign(this.submitData, {
        howManyTimes: this.form.whichTime || ''
      })
    },
    selectChangeHandle(formKey, arrKey, nextArrKey) {
      let params = this.getQueryObject(formKey, arrKey)
      if (!params) return
      if (formKey === 'workArea') {
        this.submitData = params
        return
      }
      this.querySelector(params, nextArrKey)
    },
    querySelector(params, nextArrKey) {
      // this.loadingText = '数据查询中...'
      // this.isLoading = false
      this.$loadingState(true, '数据查询中')
      request.post(API.DINGTALK_QUALITY_QUERY, params).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.errorCode
        if (errorCode) {
          this[nextArrKey] = res.data.data || []
        }
      }).catch(err => {
        this.$loadingState(false)
      })
    },
    doSubmit() {
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.DINGTALK_QUALITY_VERIFY_SAVE, this.submitData)
          .then(res => {
            this.$loadingState(false)
            dAlert(res.data.msg, () => {
              if (res.data.code === '1000') {
                this.$router.back()
              }
            })
          })
          .catch(err => {
            this.$loadingState(false)
          })
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.querySelector({}, 'forestries')
    this.$title('验收区域申请表')
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 110px;
}
</style>
