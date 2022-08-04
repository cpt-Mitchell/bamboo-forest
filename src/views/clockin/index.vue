<template>
  <div style="height: 100%;background:#fff;">
    <div>
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>选择考勤项</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.type" class="van-field__control">
                <option value="" selected disabled>请选择</option>
                <option v-for="(option, index) in clockTypeOpts" :key="index" :value="option.value">{{
                  option.label
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);" v-if="form.type === 3">
          <div class="van-cell__title">
            <span>时段</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.period" class="van-field__control">
                <option value="" selected>请选择</option>
                <option v-for="(option, index) in periodOpts" :key="index" :value="option.value">{{
                  option.label
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);" v-if="form.type === 3">
          <div class="van-cell__title">
            <span>原因</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select v-model="form.reason" class="van-field__control">
                <option value="" selected>请选择</option>
                <option v-for="(option, index) in reasonOpts" :key="index" :value="option.value">{{
                  option.label
                }}</option>
              </select>
            </div>
          </div>
        </div>
      </van-cell-group>
      <div style="padding: 0 6px;">
        <map-view @result="getGeolocationResult" show-address></map-view>
      </div>
    </div>
    <footbar>
      <van-row>
        <!-- <mu-col>
                <mu-button full-width color="success" :disabled="isLoading" style="height: 40px" @click="!isLoading?submit(false):null">保存</mu-button>
        </mu-col>-->
        <van-col span="24">
          <van-button @click="doSubmit()" style="width:100%;height:40px;" type="primary">提交</van-button>
        </van-col>
      </van-row>
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
      form: {
        type: ''
      },
      clockTypeOpts: [
        {
          label: '上班报到',
          value: 1
        },
        {
          label: '下班确认',
          value: 2
        },
        {
          label: '上下班异常申请',
          value: 3
        }
      ],
      periodOpts: [
        {
          label: '上午上班',
          value: '上午上班'
        },
        {
          label: '上午下班',
          value: '上午下班'
        },
        {
          label: '下午上班',
          value: '下午上班'
        },
        {
          label: '下午下班',
          value: '下午下班'
        }
      ],
      reasonOpts: [
        {
          label: '外出工作没有考勤点',
          value: '外出工作没有考勤点'
        },
        {
          label: '工作过程中交通工具故障',
          value: '工作过程中交通工具故障'
        },
        {
          label: '台风、暴雨天气',
          value: '台风、暴雨天气'
        },
        {
          label: '上下班时在前往工作点途中',
          value: '上下班时在前往工作点途中'
        }
      ],
      position: {},
      originPosition: {}
    }
  },
  watch: {
    'form.type': function() {
      this.form.period = ''
      this.form.reason = ''
    }
  },
  mounted() {
    this.locate = this.$route.query.locate
    this.$title('上下班')
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
    // submit() {
    // this.$refs.form.validate().then(result => {
    //   if (result) {
    //     this.dialogObj.title = '请确认定位信息'
    //     this.dialogObj.msg = this.position.address
    //     this.openAlert = true
    //   }
    // })
    // },
    doSubmit() {
      if (!this.form.type) {
        this.$dAlert('请选择考勤项')
        return false
      }
      if (this.form.type === 3 && !this.form.period) {
        this.$dAlert('请选择时段')
        return false
      }
      this.$loadingState(true, '数据提交中')
      this.form.address = this.position.address
      this.form.location = this.position.latitude + ';' + this.position.longitude
      // this.form.test = this.originPosition
      request
        .post(this.form.type !== 3 ? API.DINGTALK_DUTY_SUBMITDUTY : API.DINGTALK_DUTY_SUBMITEXCEPTIONDUTY, this.form)
        .then(res => {
          this.$loadingState(false)
          this.$dAlert(res.data.msg, () => {
            if (res.data.errorCode) {
              this.$router.back()
            }
          })
        })
        .catch(err => this.$loadingState(false))
    }
  },
  components: {
    Footbar,
    MapView
  }
}
</script>
