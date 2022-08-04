<template>
  <div class="patorl-container">
    <div style="padding:0 10px">
      <van-cell-group>
        <div v-if="$route.name==='新增协管巡山工作'">
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>护林员</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.ranger" class="van-field__control">
                  <option value="" selected>请选择护林员</option>
                  <option
                    v-for="(option,index) in rangers"
                    :key="index"
                    :value="option.ranger"
                  >{{option.ranger}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>协管工种</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.assistType" class="van-field__control">
                  <option value="" selected>请选择协管工种</option>
                  <option
                    v-for="(option,index) in assistTypes"
                    :key="index"
                    :value="option.name"
                  >{{option.name}}</option>
                </select>
              </div>
            </div>
          </div>
          <van-field style="color:#333" v-model="form.content" label="具体内容" placeholder="请输入具体内容"/>
        </div>
        <div v-if="$route.name!=='新增协管巡山工作'">
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>协管工作</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.assistWorkType" class="van-field__control">
                  <option value="" selected>请选择协管工作</option>
                  <option
                    v-for="(option,index) in assistTypes"
                    :key="index"
                    :value="option.name"
                  >{{option.name}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
            <div class="van-cell__title">
              <span>是否作废</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <select v-model="form.isInvalid" class="van-field__control">
                  <option :value="false">否</option>
                  <option :value="true">是</option>
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
        <van-button
          @click="doSubmit()"
          style="width:100%;height:40px;"
          type="primary"
        >{{$route.params.id ? '协管结束' :'协管开始'}}提交</van-button>
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
      enterOrLeaveNode: {
        enter: '夜间工作出发',
        leave: '离开工作点'
      },
      position: {},
      form: {
        ranger: '',
        assistType: '',
        content: '',
        isInvalid: false
      },
      rangers: [],
      assistWorkTypes: [],
      assistTypes: [],
      requireRule: [{
        validate: val => val.length > 0,
        message: ' '
      }]
    }
  },
  methods: {
    doSubmit() {
      if (!this.position.address) {
        this.$dAlert('获取定位信息失败！')
        return false
      }
      if (this.$route.name === '新增协管巡山工作') {
        if (!this.form.ranger) {
          this.$dAlert('请选择护林员')
          return false
        }
        if (!this.form.assistType) {
          this.$dAlert('请选择协管工种')
          return false
        }
        if (!this.form.content) {
          this.$dAlert('请输入具体内容')
          return false
        }
      } else if (this.$route.name !== '新增协管巡山工作') {
        if (!this.form.assistWorkType) {
          this.$dAlert('请选择协管工作')
          return false
        }
      } else {
        return false
      }
      this.$dConfirm('确定提交所填信息吗?', () => {
        this.$loadingState(true, '数据提交中')
        let params = {},
          url = ''
        if (this.$route.name === '新增协管巡山工作') {
          url = API.DINGTALK_PATROL_ADDPATROL
          params = {
            username: this.form.ranger,
            workType: this.form.assistType,
            content: this.form.content,
            location: this.position.latitude + ';' + this.position.longitude + ';' + this.position.address
          }
        } else {
          url = API.DINGTALK_PATROL_FINISHPATROL
          params = {
            id: this.$route.params.id,
            isCancel: this.form.isInvalid,
            location: this.position.latitude + ';' + this.position.longitude + ';' + this.position.address
          }
        }
        request.post(url, params).then(resp => {
          this.$loadingState(false)
          this.$dAlert(resp.data.msg, () => {
            if (resp.data.errorCode) {
              this.$router.push({
                name: '协管工作'
              })
            }
          })
        }).catch(err => (this.$loadingState(false)))
      })
    },
    initWork() {
      this.$loadingState(true, '查询护林员信息')
      request.get(API.DINGTALK_PATROL_ADDITION).then(resp => {
        this.$loadingState(false)
        if (resp.data.errorCode) {
          let data = resp.data.data
          this.rangers = data.sublist || []
          this.assistTypes = data.workType || []
          this.form.assistWorkType = this.$route.query.type || ''
        }
      }).catch(err => (this.$loadingState(false)))
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
    this.initWork()
    this.$title(this.$route.params.id ? '协管结束' : '协管开始')
  }
}
</script>

<style lang="less">
.patorl-container {
  color: #666;
  padding-bottom: 20px;

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
