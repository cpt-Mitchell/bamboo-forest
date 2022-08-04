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
                v-model="form.lcName"
                @change="selectChangeHandle('片区联动查询',$event)"
              >
                <option :value="null" selected>请选择林场</option>
                <option
                  v-for="(option,index) in forestries"
                  :key="index"
                  :value="option['林场名称']"
                >{{option['林场名称']}}</option>
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
                @change="selectChangeHandle('林班联动查询',$event)"
              >
                <option :value="null" selected>请选择片区</option>
                <option
                  v-for="(option,index) in areas"
                  :key="index"
                  :value="option['片区名称']"
                >{{option['片区名称']}}</option>
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
                v-model="form.lbName"
              >
                <option :value="null" selected>请选择林班</option>
                <option
                  v-for="(option,index) in forestClasses"
                  :key="index"
                  :value="option['林班名称']"
                >{{option['林班名称']}}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.workDate"
          @click.native="datePickerShow()"
          label="工作日期"
          placeholder="点击选择日期"
          disabled
        />
        <van-field
          v-model="form.workContent"
          label="工作计划内容"
          rows="1"
          autosize
          type="textarea"
          placeholder="请输入工作计划内容"
        />
      </van-cell-group>
    </div>
    <date-picker
      :show="showDatePicker"
      type="date"
      @result="getDateResult"
      @close="datePickerClose"
    />
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
      form: {
        forestName: null,
        areaName: null,
        lbName: null,
        lcName: null,
        workDate: null
      },
      showDatePicker: false
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
      this.form.workDate = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'lbName']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(task = '', value) {
      let params = {
        formid: '_',
        apvResult: '_',
        module: '林场工作计划',
        task,
        payload: {
          name: value
        }
      }
      let arrKey = ''
      switch (task) {
        case '林场联动查询':
          this.resetForm(0)
          this.resetDataArr(0)
          break
        case '片区联动查询':
          this.resetDataArr(1)
          this.resetForm(1)
          arrKey = 'areas'
          break
        case '林班联动查询':
          arrKey = 'forestClasses'
          break
      }
      return { params, arrKey }
    },
    selectChangeHandle(taskName, e) {
      let result = this.getQueryObject(taskName, e.target.value)
      if (!result.params) return
      this.querySelector(result.params, result.arrKey)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request.post(API.DINGTALK_COMMON_QUERY_OR_SUBMIT, params).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.errorCode
        if (errorCode === 0) {
          this[nextArrKey] = res.data.data.lc || []
        }
      }).then(err => this.$loadingState(false))
    },
    doSubmit() {
      if (!this.form.lbName) {
        this.$dAlert('请选择林班名称')
        return false
      }
      if (!this.form.workDate) {
        this.$dAlert('请选择工作日期')
        return false
      }
      if (!this.form.workContent) {
        this.$dAlert('请输入工作内容')
        return false
      }
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        let params = {
          formid: '_',
          apvResult: '_',
          module: '林场工作计划',
          task: '林地工作计划录入',
          payload: {
            name: this.form.lbName,
            workContent: this.form.workContent,
            workDate: this.form.workDate
          }
        }
        request.post(API.DINGTALK_COMMON_QUERY_OR_SUBMIT, params).then(res => {
          let errorCode = res.data.errorCode
          this.$loadingState(false)
          dAlert(res.data.msg, () => {
            if (errorCode === 0) {
              this.$router.back()
            }
          })
        }).catch(err => (this.$loadingState(false)))
      })
    }
  },
  components: {
    Footbar,
    DatePicker
  },
  mounted() {
    this.querySelector({
      formid: '_',
      apvResult: '_',
      module: '林场工作计划',
      task: '林场联动查询'
    }, 'forestries')
    this.$title(this.$route.name)
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
