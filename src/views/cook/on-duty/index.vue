<template>
  <div class="cook">
    <van-row class="cook-header">
      <van-col span="12">
        <div
          class="grid-cell"
          style="font-size:.36rem;color:#0588ff;"
        >{{userObj['姓名'] || '-'}}（{{userObj['职位'] || '-'}}）</div>
      </van-col>
      <van-col span="12">
        <div
          class="grid-cell"
          style="font-size:.36rem;"
        >当前日期：{{new Date().getFullYear()+'.'+(new Date().getMonth()+1)+'.'+new Date().getDate()}}</div>
      </van-col>
    </van-row>
    <map-view :show-address="false" @result="getGeolocationResult"></map-view>
    <div class="locate-btn" @click="doLocate">
      <div class="locate-text">打卡定位</div>
      <div class="locate-time">{{time}}</div>
    </div>
  </div>
</template>

<script>
import MapView from '@/components/MapView'
import request from '@/utils/httpUtil'
import { parseTime } from '@/utils'
import { API } from '@/api'
export default {
  data() {
    return {
      userObj: {},
      isLoading: false,
      loadingText: '',
      time: '',
      timeInterval: null,
      stateObj: null,
      position: {}
    }
  },
  methods: {
    timeRun() {
      this.timeInterval = setInterval(() => {
        this.time = parseTime(new Date(), '{h}:{i}:{s}')
      }, 1000)
    },
    initCook() {
      request.get(API.DINGTALK_FOREST_GETCURRENT).then(res => {
        if (res.data.errorCode) {
          this.stateObj = res.data.data
          if (this.stateObj['操作']) {
            this.stateObj['操作'] = this.stateObj['操作'] + '林班'
          }
        }
      }).catch(err => console.error(err))
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
      this.$loadingState(true, '数据提交中')
      request.post(API.DINGTALK_DUTY_COOKONDUTYADD, {
        'location': this.position.latitude + ';' + this.position.longitude,
        'address': this.position.address
      }).then(res => {
        this.$loadingState(false)
        dAlert(res.data.msg, () => {
          if (res.data.errorCode) {
            window.location.reload()
          }
        })
      }).catch(err => this.$loadingState(false))
    }
  },
  destroyed() {
    this.timeInterval = null
  },
  created() {
    this.userObj = JSON.parse(window.sessionStorage.getItem('bamboo-userinfo') || '{}')
    this.timeRun()
    this.initCook()
  },
  mounted() {
    this.$title(this.$route.name)
  },
  components: {
    MapView
  }
}
</script>

<style lang="less" scoped>
.cook {
  color: #666;
  padding-bottom: 20px;
  height: 100%;

  .cook-header {
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
