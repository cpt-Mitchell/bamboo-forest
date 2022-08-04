<!-- 调整作业进度汇报人 -->
<template>
  <div class="interview-box">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          v-model="position.address"
          label="地址"
          placeholder="请重新定位"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="position.longitude"
          label="经度"
          placeholder="请重新定位"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="position.latitude"
          label="纬度"
          placeholder="请重新定位"
          disabled
        />
      </van-cell-group>
      <div style="padding: 0 6px;">
        <map-view @result="getGeolocationResult"></map-view>
      </div>
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
import MapView from '@/components/MapView'
import {
  parseTime
} from '@/utils'
export default {
  data() {
    return {
      position: {},
      originPosition: {}
    }
  },
  components: {
    MapView,
    Footbar
  },
  methods: {
    getGeolocationResult({ position, formattedAddress, result }) {
      this.position = {
        address: formattedAddress || '',
        latitude: position.lat || '',
        longitude: position.lng || ''
      }
      this.originPosition = JSON.stringify(result)
      this.$loadingState(false)
    },
    doSubmit() {
      if (!this.$route.query.id) {
        dAlert('记录ID不能为空!')
        return false
      } else if (!this.position.address || !this.position.longitude || !this.position.latitude) {
        dAlert('定位经纬度或地址为空，请重新定位!')
        return false
      }
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        request
          .post(API.DINGTALK_OA_COMMON_SUBMITAPV, {
            formid: '-',
            apvResult: '_',
            module: '竹林考勤定点',
            task: '提交',
            payload: {
              locationResponsibleID: this.$route.query.id,
              location: `${this.position.latitude};${this.position.longitude};20;${parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')};${this.position.address}`
            }
          })
          .then(res => {
            this.$loadingState(false)
            this.$dAlert(res.data.msg || '', () => {
              if (res.data.errorCode === 0) {
                this.$router.push({
                  name: '定点列表'
                })
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    }
  },
  mounted() {
    this.$title(this.$route.meta.title)
  }
}
</script>

<style lang="less">
.interview-box {
  .van-field .van-cell__title {
    max-width: 100px;
    input[type='number'] {
      font-size: 0.32rem;
    }
  }
}
</style>
