<!-- 工作里程拍照 -->
<template>
  <div class="work-mile-container">
    <div style="padding:0 10px;">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          label="使用人"
          placeholder="自动带出使用人"
          v-model="form.empName"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          placeholder="自动带出使用人部门"
          label="使用人部门"
          v-model="form.deptName"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          placeholder="自动带出使用人职务"
          label="使用人职务"
          v-model="form.jobName"
          disabled
        />
        <van-field class="no-disabled_bgcolor" v-model="form.photoTime" label="时间" disabled />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>时段</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" v-model="form.rangeType" @change="checkPeriod">
                <option :value="null" selected>请选择时段</option>
                <option v-for="(option, index) in periodOptions" :key="index" :value="option.value">{{
                  option.label
                }}</option>
              </select>
            </div>
          </div>
        </div>
        <van-field label="里程表数" placeholder="请输入里程表数" v-model="form.kilometre" />
        <van-field
          class="no-disabled_bgcolor"
          label="里程表拍照"
          placeholder="点击拍照"
          v-model="form.photoName"
          @click.native="TakePhoto"
          disabled
        >
          <van-button v-if="form.photoUrl" slot="button" size="small" type="info" @click="showFile(form.photoUrl)"
            >查看</van-button
          >
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          label="拍照地点"
          placeholder="拍照完成后自动定位地点"
          v-model="form.photoPlace"
          disabled
        />
      </van-cell-group>
    </div>
    <map-view v-if="locateShow" v-show="false" @result="getGeolocationResult" show-address></map-view>
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
import { parseTime } from '@/utils/index'
import { TakePhoto } from '@/plugins/cordovaplugin'
import { ImagePreview } from 'vant'
import MapView from '@/components/MapView'
export default {
  data() {
    return {
      locateShow: false,
      loginUser: this.$store.state.appUser,
      photo: {
        name: '',
        url: ''
      },
      validProps: {
        empName: '使用人',
        empNo: '使用人员工号',
        deptId: '使用人部门号',
        deptName: '使用人部门',
        jobName: '使用人职位',
        jobCode: '使用人职位号',
        rangeType: '时段', // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
        kilometre: '里程表数',
        photoName: '里程拍照',
        photoUrl: '里程表拍照链接',
        photoPlace: '拍照地点'
      },
      form: {
        empName: '',
        empNo: '',
        deptId: '',
        deptName: '',
        jobName: '',
        jobCode: '',
        photoTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
        rangeType: null, // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
        kilometre: null,
        photoName: '',
        photoUrl: '',
        photoPlace: ''
      },
      periodOptions: [
        {
          label: '月初',
          value: 1
        },
        {
          label: '月末',
          value: 2
        },
        {
          label: '新里程表开始',
          value: 3
        },
        {
          label: '新里程表结束',
          value: 4
        }
      ]
    }
  },
  watch: {
    'form.url': val => {
      this.form.photoUrl = val
    }
  },
  methods: {
    getGeolocationResult({ position, formattedAddress, result }) {
      this.form.photoPlace = formattedAddress
      this.locateShow = false
      this.$loadingState(false)
    },
    TakePhoto(e) {
      if (e.target.tagName === 'BUTTON') {
        return false
      }
      TakePhoto(
        file => {
          this._onChange(file)
        },
        e => {}
      )
    },
    _onChange: function(file) {
      this.uploadImage(file.base64)
    },
    uploadImage(file) {
      const uploadReqeust = (params, cb) => {
        this.$loadingState(true, '照片正在上传')
        request
          .post(API.DINGTALK_BASE64FILEUPLOAD, params)
          .then(res => {
            cb && cb(res)
          })
          .catch(err => {
            this.$loadingState(false)
            dAlert('上传异常!')
          })
      }
      uploadReqeust({ base64: file }, res => {
        let errorCode = res.data.errorCode
        if (errorCode) {
          let name = res.data.data.destination || ''
          this.form.photoUrl = res.data.data.url + name
          this.form.photoName = name
          this.photo = res.data.data
          this.locateShow = true
        } else {
          this.$dAlert('上传失败')
        }
      })
    },
    showFile(link = '') {
      if (!link) {
        return false
      }
      ImagePreview([link])
    },
    getUserInfo() {
      request.get(API.DINGTALK_PERSONAL_INFO + `/${this.loginUser.id}`).then(res => {
        let data = res.data || {}
        let { deptNameShort = '', deptId = '', name = '', emplid = '', positionName = '', positionCode = '' } =
          data.data || {}
        this.form.deptName = deptNameShort
        this.form.empName = name
        this.form.jobName = positionName
        this.form.jobCode = positionCode
        this.form.deptId = deptId
        this.form.empNo = emplid
      })
    },
    checkPeriod() {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '摩托车里程拍照',
        task: '校验时段',
        payload: {
          user_id: this.loginUser.id,
          rangeType: this.form.rangeType, // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
          photoTime: this.form.photoTime // 2019-11-15 14:10:00
        }
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          data = data.data.check || {}
          if (!data.success) {
            this.$dAlert(data.msg || '')
          }
        })
        .catch(err => this.$loadingState(false))
    },
    doSubmit() {
      let payload = Object.assign({}, this.form, { photo: this.photo })
      let validMsg = ''
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          const element = payload[key]
          console.log(key, element)
          if (element === '' || element === null || element === undefined) {
            validMsg = key
            break
          }
        }
      }
      if (validMsg) {
        this.$dAlert(this.validProps[validMsg] + '不能为空')
        return false
      }
      this.$dConfirm('确定提交表单内容吗？', () => {
        this.$loadingState(true, '数据提交中')
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '摩托车里程拍照',
          task: '工作里程拍照',
          payload
        }
        this.$loadingState(true, '数据提交中')
        request
          .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
          .then(res => {
            this.$loadingState(false)
            let data = res.data || {}
            if (data.errorCode === 0) {
              let result = data.data || {}
              this.$dAlert(result.submit.msg || '提交成功', () => {
                if (result.submit && result.submit.success) {
                  this.$router.back()
                }
              })
            } else {
              this.$dAlert(data.msg || '')
            }
          })
          .catch(err => {
            console.error(err)
            this.$loadingState(false)
          })
      })
    }
  },
  components: {
    Footbar,
    MapView
  },
  created() {
    this.getUserInfo()
  },
  mounted() {
    this.$title(this.$route.name)
  }
}
</script>

<style lang="less">
.work-mile-container {
  .van-field .van-cell__title {
    max-width: 90px;
    input[type='number'] {
      font-size: 0.32rem;
    }
  }
}
</style>
