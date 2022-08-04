<template>
  <div class="patorl-exception-container">
    <div style="padding:0 10px">
      <van-cell-group>
        <div>
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>巡山点名称</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.PatrolPoiID" class="van-field__control">
                  <option value="" selected>请选择巡山点</option>
                  <option v-for="(option, index) in patrolPois" :key="index" :value="option.PatrolPoiID">{{
                    option.PatrolName
                  }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>异常原因</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.Reason" class="van-field__control">
                  <option value="" selected>请选择异常原因</option>
                  <option v-for="(option, index) in exceptions" :key="index" :value="option.Reason">{{
                    option.Reason
                  }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>
      <map-view :show-address="true" @result="getGeolocationResult"></map-view>
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
import MapView from '@/components/MapView'
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      position: {},
      form: {
        PatrolPoiID: '',
        Reason: ''
      },
      patrolPois: [],
      exceptions: []
    }
  },
  methods: {
    doSubmit() {
      if (!this.position.address) {
        this.$dAlert('获取定位信息失败！')
        return false
      }
      if (!this.form.PatrolPoiID) {
        this.$dAlert('请选择巡山点名称')
        return false
      }
      if (!this.form.Reason) {
        this.$dAlert('请选择异常原因')
        return false
      }
      this.$dConfirm('确定提交所填信息吗?', () => {
        this.$loadingState(true, '数据提交中')
        let date = new Date()
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '竹林巡山异常报到',
          task: '巡山异常审核提交',
          payload: {
            PatrolPoiID: this.form.PatrolPoiID,
            Reason: this.form.Reason,
            Location: `gis://${this.position.latitude};${this.position.longitude};3;${date.getFullYear() +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getDate() +
              ' ' +
              date.getHours() +
              ':' +
              date.getMinutes() +
              ':' +
              date.getSeconds()};64;${this.position.address}`
          }
        }
        this.$loadingState(true, '正在提交')
        request
          .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
          .then(res => {
            this.$loadingState(false)
            let data = res.data || {}
            this.$dAlert(data.msg || '', () => {
              if (data.errorCode === 0) {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    },
    initWork() {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '竹林巡山异常报到',
        task: '查询巡山点',
        payload: {
          keyword: ''
        }
      }
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          let result = data.data.data
          this.patrolPois = result || []
        })
        .catch(err => {})
    },
    getExceptionReasons() {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '竹林巡山异常报到',
        task: '查询原因',
        payload: {
          keyword: ''
        }
      }
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          let result = data.data.data
          this.exceptions = result || []
        })
        .catch(err => {})
    },
    getGeolocationResult({ position, formattedAddress }) {
      this.position = {
        address: formattedAddress || '',
        latitude: position.lat || '',
        longitude: position.lng || ''
      }
    }
  },
  components: {
    Footbar,
    MapView
  },
  mounted() {
    this.$title('巡山异常报到')
    this.initWork()
    this.getExceptionReasons()
  }
}
</script>

<style lang="less">
.patorl-exception-container {
  color: #666;
  padding-bottom: 20px;
  .van-field .van-cell__title {
    max-width: 90px !important;
  }

  // .mu-form-item {
  //   min-height:26px !important;
  // }
  .van-switch__node {
    font-size: 30px;
  }
  #container {
    width: 100%;
    height: 200px;
  }

  .option {
    padding: 0px 10px;
  }
}
</style>
