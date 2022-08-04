<template>
  <div class="daywork" style="height: 100%;">
    <div style="padding:5px 8px">
      <van-row class="daywork-header" v-if="stateObj.ID">
        <van-col span="16">
          <div
            class="grid-cell"
            style="font-size:.36rem;color:#333;height:50px;width:100%;white-space:nowrap;padding-right:15px;text-overflow:ellipsis;"
          >{{stateObj['工作林班'] || '-'}}</div>
        </van-col>
        <van-col span="8">
          <div class="grid-cell" style="font-size:.36rem;">{{(stateObj['进入林班时间']).substring(0,16)}}</div>
        </van-col>
      </van-row>
      <LocateAxis
        :title="'林班工作定位记录时间和位置'"
        :todo="todoList"
        :position="position"
        v-if="position.address"
      ></LocateAxis>
      <map-view :show-address="true" @result="getGeolocationResult"></map-view>
      <div class="locate-btn" @click="doLocate">
        <div class="locate-text">{{ todoList[todoList.length-1] }}定位</div>
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
      time: '',
      timeInterval: null,
      stateObj: {},
      todoList: [],
      position: {},
      originPosition: ''
    }
  },
  methods: {
    timeRun() {
      this.timeInterval = setInterval(() => {
        this.time = parseTime(new Date(), '{h}:{i}:{s}')
      }, 1000)
    },
    initDaywork() {
      if (!this.$route.params.id) {
        this.todoList = ['进入林班']
        return false
      } else {
        this.todoList = ['进入林班', '离开林班']
      }
      this.$loadingState(true, '查询当前林班状态')
      request
        .get(API.DINGTALK_FOREST_GETRECORD + this.$route.params.id)
        .then(resp => {
          // 关闭loading放到定位中去执行 不然地图没显示完成loading就消失了
          // this.$loadingState(false)
          if (resp.data.errorCode) {
            this.stateObj = resp.data.data
            if (this.stateObj['操作']) {
              this.stateObj['操作'] = this.stateObj['操作'] + '林班'
            }
          }
        })
        .catch(err => (this.$loadingState(false)))
    },
    getGeolocationResult({ position, formattedAddress, result }) {
      this.position = {
        address: formattedAddress || '',
        latitude: position.lat || '',
        longitude: position.lng || ''
      }
      this.originPosition = JSON.stringify(result)
    },
    doLocate() {
      if (this.$store.state.isLoading) {
        return false
      }
      if (!this.position.address) {
        this.$dAlert('定位地址获取失败!')
        return false
      }
      this.$loadingState(true, '数据提交中')
      request.post(API.DINGTALK_FOREST_ENTERORLEAVE, {
        id: this.stateObj.ID || 0,
        location: this.position.latitude + ';' + this.position.longitude + ';' + this.position.address,
        test: this.originPosition
      })
        .then(res => {
          this.$loadingState(false)
          this.$dAlert(res.data.msg, () => {
            if (res.data.errorCode) {
              this.$router.back()
            }
          })
        })
        .catch(err => (this.$loadingState(false)))
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
    // this.userObj = JSON.parse(
    //   window.localStorage.getItem('bamboo-appLoginUser') || '{}'
    // )
    this.timeRun()
    this.initDaywork()
  },
  mounted() {
    this.$title('林班工作')
  }
}
</script>

<style lang="less" scoped>
.daywork {
  color: #666;
  padding-bottom: 20px;
  height: 100%;

  .daywork-header {
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
