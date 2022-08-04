<template>
  <div class="nightwork">
    <div class="errand-head">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>工作类型</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.workType" class="van-field__control">
                <option value="" selected>请选择工作类型</option>
                <option
                  v-for="(option,index) in workTypes"
                  :key="index"
                  :value="option.name"
                >{{option.name}}</option>
              </select>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-row style="padding:10px 15px 0;color:#333;" v-if="currentWork['出发时间']">
        <van-col
          span="24"
        >{{(currentWork['出发时间']||'').substring(0,10)}}{{currentWork['工作林班']}}{{currentWork['夜间野外工作类型']}}</van-col>
      </van-row>
      <locate-axis
        :title="'夜间工作定位记录时间和位置'"
        :todo="todoList"
        :todoTime="todoTime"
        :position="position"
        v-if="position.address"
      ></locate-axis>
      <map-view :show-address="false" @result="getGeolocationResult"></map-view>
      <div class="locate-btn" @click="doLocate">
        <div class="locate-text">{{currentWork.next || '夜间出发' }}</div>
        <div class="locate-time">{{time}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LocateAxis from '@/components/LocateAxis'
import MapView from '@/components/MapView'
import request from '@/utils/httpUtil'
import {
  parseTime
} from '@/utils/index'
import { API } from '@/api'
export default {
  data() {
    return {
      todoList: [],
      todoTime: [],
      currentWork: {},
      time: '',
      timeInterval: null,
      position: {},
      form: {
        nodeType: '',
        remark: ''
      },
      workTypes: []
    }
  },
  methods: {
    timeRun() {
      this.timeInterval = setInterval(() => {
        this.time = parseTime(new Date(), '{h}:{i}:{s}')
      }, 1000)
    },
    getWorkType() {
      request
        .get(API.DINGTALK_FOREST_NIGHTWORKTYPE)
        .then(resp => {
          if (resp.data.errorCode) {
            this.workTypes = resp.data.data
          }
        })
        .catch(err => { })
    },
    initWork() {
      this.todoList = ['夜间工作出发']
      if (!this.$route.params.id) {
        return
      }
      this.$loadingState(true, '查询当前林班状态')
      request
        .get(API.DINGTALK_FOREST_NIGHTDETAIL + this.$route.params.id)
        .then(resp => {
          // 关闭loading放到定位中去执行 不然地图没显示完成loading就消失了
          // this.$loadingState(false)
          if (resp.data.errorCode) {
            let data = resp.data.data
            this.currentWork = data
            let stepArr = []
            if (data['出发时间']) {
              this.todoList.push('到达工作点')
              stepArr.push('出发时间')
              if (data['到达时间']) {
                this.todoList.push('离开工作点')
                stepArr.push('到达时间')
                if (data['离开时间']) {
                  this.todoList.push('回到居住点')
                  stepArr.push('离开时间')
                  if (data['回到居住点时间']) {
                    stepArr.push('回到居住点时间')
                  }
                }
              }
            }
            this.todoList.forEach((item, index) => {
              this.todoTime.push((data[stepArr[index]]).substring(11, 16))
            })
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    getGeolocationResult({ position, formattedAddress }) {
      this.position = {
        address: formattedAddress || '',
        latitude: position.lat || '',
        longitude: position.lng || ''
      }
    },
    doLocate() {
      this.doSubmit()
      // if (this.$route.name !== '新增夜间工作') {
      //   this.doSubmit()
      //   return false
      // }
      // this.$refs.form.validate().then(result => {
      //   if (result) {
      //     this.doSubmit()
      //   }
      // })
    },
    doSubmit() {
      if (!this.position.address) {
        this.$dAlert('获取定位信息失败！')
        return false
      }
      if (this.$route.name === '新增夜间工作' && !this.form.workType) {
        this.$dAlert('请选择工作类型！')
        return false
      }
      this.$dConfirm('请确认定位位置信息：' + this.position.address, () => {
        let api = '',
          params = {
            location: this.position.latitude + ';' + this.position.longitude + ';' + this.position.address
          }
        if (this.$route.name === '新增夜间工作') {
          api = API.DINGTALK_FOREST_NIGHTSETOUT
          params = Object.assign({}, params, {
            workType: this.form.workType || ''
          })
        } else if (this.$route.name === '夜间工作详情') {
          api = API.DINGTALK_FOREST_NIGHTSAVE
          params = Object.assign({}, params, {
            id: this.$route.params.id,
            action: this.currentWork.next || ''
          })
        }
        this.$loadingState(true, '数据提交中')
        request.post(api, params).then(resp => {
          this.$loadingState(false)
          dAlert(resp.data.msg, () => {
            if (resp.data.errorCode) {
              if (this.currentWork.next !== '回到居住点') {
                window.location.reload()
              } else {
                this.$router.back()
              }
            }
            this.$router.back()
          })
        })
          .catch(err => (this.$loadingState(false)))
      })
    }
  },
  components: {
    LocateAxis,
    MapView
  },
  destroyed() {
    this.timeInterval = null
  },
  created() {
    this.timeRun()
    this.getWorkType()
    this.initWork()
  },
  mounted() {
    this.$title(this.$route.name)
  }
}
</script>

<style lang="less" scoped>
.nightwork {
  color: #666;
  padding-bottom: 20px;
  min-height: 100%;
  background: #fff;
  padding: 0 5px;

  .nightwork-header {
    height: 50px;
    line-height: 50px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 0 0.42rem;
  }

  .mu-form-item {
    min-height: 36px !important;
  }

  .locate-btn {
    border: none;
    width: 3.6rem;
    height: 3.6rem;
    line-height: 0.6rem;
    border-radius: 50%;
    background: #0588ff;
    color: #fff;
    font-size: large;
    text-align: center;
    margin: 0.7rem auto 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:active {
      opacity: 0.7;
    }
  }
}
</style>
