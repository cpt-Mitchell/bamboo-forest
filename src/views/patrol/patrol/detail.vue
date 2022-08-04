<template>
  <div class="patrol">
    <div class="card card-part" v-if="stateObj.ID">
      <van-row style="padding:10px 15px 0;color:#333;">
        <van-col :span="7">{{stateObj.title}}</van-col>
        <van-col :span="5">{{(stateObj['到达时间']||'').substring(0,16)}}</van-col>
      </van-row>
    </div>
    <locate-axis
      :title="'巡山工作定位记录时间和位置'"
      :todo="todoList"
      :position="position"
      v-if="position.address"
    ></locate-axis>
    <map-view :show-address="false" @result="getGeolocationResult"></map-view>
    <div class="locate-btn" @click="doLocate">
      <div class="locate-text">{{todoList[todoList.length-1]}}</div>
      <div class="locate-time">{{time}}</div>
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
      time: '',
      timeInterval: null,
      stateObj: {},
      position: {}
    }
  },
  methods: {
    timeRun() {
      this.timeInterval = setInterval(() => {
        this.time = parseTime(new Date(), '{h}:{i}:{s}')
      }, 1000)
    },
    initPatrol(id) {
      this.$loadingState(true, '查询当前巡山状态')
      request.get(API.DINGTALK_PATROL_ENTERRECORD + id).then(resp => {
        this.$loadingState(false)
        if (resp.data.errorCode) {
          this.stateObj = resp.data.data
          if (this.stateObj['操作']) {
            this.stateObj['操作'] = this.enterOrLeaveNode.enter
          }
        } else {
          dAlert(resp.data.msg)
        }
      }).catch(err => this.$loadingState(false))
    },
    getGeolocationResult({ position, formattedAddress }) {
      this.position = {
        address: formattedAddress || '',
        latitude: position.lat || '',
        longitude: position.lng || ''
      }
    },
    doLocate() {
      if (!this.position.address) {
        dAlert('获取定位信息失败！')
        return
      }
      this.$loadingState(true, '数据加载中')
      request.post(API.DINGTALK_PATROL_ENTERORLEAVE, {
        'id': this.stateObj.ID || 0,
        'location': this.position.latitude + ';' + this.position.longitude + ';' + this.position.address
      }).then(resp => {
        this.$loadingState(false)
        dAlert(resp.data.msg, () => {
          if (resp.data.errorCode) {
            this.$router.back()
          }
        })
      }).catch(err => this.$loadingState(false))
    }
  },
  components: {
    LocateAxis,
    MapView
  },
  destroyed() {
    this.timeInterval = null
  },
  mounted() {
    this.timeRun()
    if (this.$route.params.id) {
      this.todoList = ['巡山到达', '巡山离开']
      this.initPatrol(this.$route.params.id)
    } else {
      this.todoList = ['巡山到达']
    }
    this.$title('巡山工作')
  }
}
</script>

<style lang="less" scoped>
.patrol {
  color: #666;
  padding-bottom: 20px;
  height: 100%;

  .patrol-header {
    height: 50px;
    line-height: 50px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 0 0.42rem;
  }

  .locate-btn {
    margin-top: 2rem;
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
