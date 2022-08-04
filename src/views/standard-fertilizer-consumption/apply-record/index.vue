<template>
  <div class="apply-record-box">
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
                :disabled="lcList.length == 0"
                v-model="form.lcName"
                @change="getPqList"
              >
                <option value="" selected>请选择林场</option>
                <option v-for="(option, index) in lcList" :key="index" :value="option['林场名称']">{{
                  option['林场名称']
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
                :disabled="pqList.length == 0"
                v-model="form.pqName"
                @change="getLbList"
              >
                <option value="" selected>请选择片区</option>
                <option v-for="(option, index) in pqList" :key="index" :value="option['片区名称']">{{
                  option['片区名称']
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
                :disabled="lbList.length == 0"
                v-model="form.lbName"
                @change="getAreaList"
              >
                <option value="" selected>请选择林班</option>
                <option v-for="(option, index) in lbList" :key="index" :value="option['林班名称']">{{
                  option['林班名称']
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>树种</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" :disabled="treeTypes.length == 0" v-model="form.treeType">
                <option value="" selected>请选择树种</option>
                <option v-for="(option, index) in treeTypes" :key="index" :value="option['树种名称']">{{
                  option['树种名称']
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>区域</span>
          </div>
          <div class="van-cell__value">
            <div
              class="van-field__body"
              style="padding: 0 10px;text-align:left;"
              :style="{ color: form.areas.length ? '#333' : '#969799' }"
              @click="openAreasDialog"
            >
              {{ form.areas.join(',') || '请选择区域' }}
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <area-select
      title="区域选择"
      :data="areaList"
      :display="showArea"
      @close="closeArea"
      @result="getResult"
    ></area-select>
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
import AreaSelect from '../area-select'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      lcList: [],
      pqList: [],
      lbList: [],
      treeTypes: [],
      areaList: [],
      form: {
        lcName: '',
        pqName: '',
        lbName: '',
        treeType: '',
        areas: []
      },
      showArea: false,
      showDatePicker: false,
      areaDialogCanDisplay: false
    }
  },
  watch: {
    'form.lcName'() {
      this.form.pqName = ''
      this.pqList = []
      this.form.lbName = ''
      this.lbList = []
      this.form.areas = []
      this.areaList = []
      this.areaDialogCanDisplay = false
    },
    'form.pqName'() {
      this.form.lbName = ''
      this.lbList = []
      this.form.areas = []
      this.areaList = []
      this.areaDialogCanDisplay = false
    },
    'form.lbName'() {
      this.form.areas = []
      this.areaList = []
      this.areaDialogCanDisplay = false
    }
  },
  methods: {
    filterInputSize(size, key) {
      let number = parseFloat(this.form[key]).toFixed(size)
      this.form[key] = number
    },
    openAreasDialog() {
      if (!this.areaDialogCanDisplay) {
        dAlert('当前林班无可选区域')
        return false
      }
      this.showArea = true
    },
    closeArea() {
      this.showArea = false
    },
    getResult(result) {
      this.form.areas = result.map(item => item['区域编号'])
      this.closeArea()
    },
    getAreaInfoList(areas) {
      const funcs = areas.map(item => {
        return new Promise((resolve, reject) => {
          let params = {
            formid: '_',
            apvResult: '_',
            module: '竹林APP',
            task: '基础数据-通过区域编号获取的相关信息',
            payload: {
              areaId: item['区域编号']
            }
          }
          request
            .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
            .then(res => {
              let data = res.data || {}
              if (data.errorCode !== 0) {
                resolve(null)
                return false
              }
              data = data.data || {}
              if (data.audit.length !== 0) {
                resolve(data.audit[0])
              } else {
                resolve(null)
              }
            })
            .catch(err => {
              resolve([])
            })
        })
      })
      Promise.all(funcs)
        .then(result => {
          this.areaList = result.filter(item => {
            if (item !== null) {
              item.checked = false
              return item
            }
          })
          this.areaDialogCanDisplay = this.areaList.length !== 0
        })
        .catch(e => {
          console.log(e)
        })
    },
    getAreaList() {
      let lb = this.lbList.find(item => item['林班名称'] === this.form.lbName)
      if (!lb) {
        return false
      }
      let params = {
        formid: '_',
        apvResult: '_',
        module: '竹林APP',
        task: '基础数据-查询可选区域',
        payload: {
          lbId: lb.ID
        }
      }
      this.$loadingState(true, '正在查询')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data || {}
          this.getAreaInfoList(data.audit || [])
        })
        .catch(err => this.$loadingState(false))
    },
    getTreeList() {
      let params = {
        formid: '_',
        apvResult: '_',
        module: '竹林APP',
        task: '基础数据-查询树种',
        payload: {}
      }
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data || {}
          this.treeTypes = data.audit || []
        })
        .catch(err => {})
    },
    getLbList() {
      let pq = this.pqList.find(item => item['片区名称'] === this.form.pqName)
      if (!pq) {
        return false
      }
      let params = {
        formid: '_',
        apvResult: '_',
        module: '竹林APP',
        task: '基础数据-查询林班',
        payload: {
          areaId: pq.ID
        }
      }
      this.$loadingState(true, '正在查询')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data || {}
          this.lbList = data.audit || []
        })
        .catch(err => this.$loadingState(false))
    },
    getPqList() {
      let lc = this.lcList.find(item => item['林场名称'] === this.form.lcName)
      if (!lc) {
        return false
      }
      let params = {
        formid: '_',
        apvResult: '_',
        module: '竹林APP',
        task: '基础数据-查询片区',
        payload: {
          lcId: lc.ID
        }
      }
      this.$loadingState(true, '正在查询')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data || {}
          this.pqList = data.audit || []
        })
        .catch(err => this.$loadingState(false))
    },
    getLcList() {
      let params = {
        formid: '_',
        apvResult: '_',
        module: '竹林APP',
        task: '基础数据-查询林场',
        payload: {}
      }
      this.$loadingState(true, '正在查询')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data || {}
          this.lcList = data.audit || []
        })
        .catch(err => this.$loadingState(false))
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
    AreaSelect,
    DatePicker
  },
  mounted() {
    this.getLcList()
    this.getTreeList()
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
