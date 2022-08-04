<!-- 调整作业进度汇报人 -->
<template>
  <div class="odometer-damaged-box">
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
        <div class="van-cell van-field" style="color: rgb(51, 51, 51);">
          <div class="van-cell__title">
            <span>损坏时段</span>
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
        <template v-if="form.rangeType !== 3">
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
            v-model="form.photoPlace"
            placeholder="拍照完成后显示"
            disabled
          />
        </template>
        <template v-if="form.rangeType === 3">
          <div class="sub-title">
            <van-row>
              <van-col span="24">损坏期间</van-col>
            </van-row>
          </div>
          <van-field
            class="no-disabled_bgcolor"
            label="出发日期"
            v-model="form.fromTime"
            placeholder="点击选择日期"
            @click.native="datePickerShow('fromTime')"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            label="出发地点"
            placeholder="选择出发日期后自动带出"
            v-model="form.fromPlace"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            label="到达日期"
            v-model="form.toDate"
            placeholder="点击选择日期"
            @click.native="datePickerShow('toDate')"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            label="到达地点"
            placeholder="选择到达日期后自动带出"
            v-model="form.toPlace"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            label="损坏期间工作里程"
            placeholder="请输入损坏期间工作里程"
            v-model="form.destroyKm"
          />
          <div class="sub-title">
            <van-row>
              <van-col span="24">&nbsp;</van-col>
            </van-row>
          </div>
          <van-field
            v-model="form.reason"
            label="签证理由"
            type="textarea"
            autosize
            rows="1"
            placeholder="请输入签证理由"
          />
          <van-field
            class="no-disabled_bgcolor"
            label="出发签证人"
            placeholder="点击选择出发签证人"
            v-model="fromUser.name"
            @click.native="userSelectorShowHandle('from')"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            placeholder="点击选择到达签证人"
            label="到达签证人"
            v-model="toUser.name"
            @click.native="userSelectorShowHandle('to')"
            disabled
          />
        </template>
      </van-cell-group>
    </div>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <user-picker
      :selected="userPicerSelected()"
      :display="userSelectorShow"
      @close="closePicker"
      @result="getUserResultHandle"
    ></user-picker>
    <map-view v-if="locateShow" v-show="false" @result="getGeolocationResult" show-address></map-view>
    <footbar>
      <van-col span="12">
        <van-button @click="doSubmit(0)" style="width:100%;height:40px;" type="info">暂存</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="doSubmit(1)" style="width:100%;height:40px;" type="primary">提交</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import DatePicker from '@/components/DatePicker'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
import UserPicker from '@/components/UserPicker'
import { TakePhoto } from '@/plugins/cordovaplugin'
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
      fromUser: {},
      toUser: {},
      currentUserPickerKey: '',
      dateKey: null,
      form: {
        photoTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
        empName: '',
        empNo: '',
        deptId: '',
        deptName: '',
        jobName: '',
        jobCode: '',
        rangeType: null, // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
        kilometre: null,
        photoName: '',
        photoUrl: '',
        photoPlace: '',
        fromTime: '',
        fromPlace: '',
        toTime: '',
        toPlace: '',
        destroyKm: '',
        reason: '',
        fromVerifierName: '',
        fromVerifierNo: '',
        toVerifierName: '',
        toVerifierNo: ''
      },
      periodOptions: [
        {
          label: '开始',
          value: 1
        },
        {
          label: '结束',
          value: 2
        },
        {
          label: '损坏期间',
          value: 3
        }
      ],
      validProps: {
        empName: '使用人',
        empNo: '使用人员工号',
        deptId: '使用人部门号',
        deptName: '使用人部门',
        jobName: '使用人职位',
        jobCode: '使用人职位号',
        rangeType: '损坏时段', // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
        kilometre: '里程表数',
        photoName: '里程拍照',
        photoUrl: '里程表拍照链接',
        photoPlace: '拍照地点',
        fromTime: '出发时间',
        fromPlace: '出发地点',
        toTime: '到达时间',
        toPlace: '到达地点',
        destroyKm: '损坏期间工作里程',
        reason: '签证理由',
        fromVerifierName: '出发签证人',
        fromVerifierNo: '出发签证人工号',
        toVerifierName: '到达签证人',
        toVerifierNo: '到达签证人工号'
      },
      userSelectorShow: false,
      showDatePicker: false
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
    userPicerSelected() {
      if (this.currentUserPickerKey === 'from' && this.fromUser.id) {
        return [this.fromUser]
      } else if (this.currentUserPickerKey === 'to' && this.toUser.id) {
        return [this.toUser]
      }
      return []
    },
    getUserInfo(cb) {
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
        this.$nextTick(() => {
          cb && cb()
        })
      })
    },
    getUserResultHandle(result) {
      if (result && result.users && result.users.length > 0) {
        this[this.currentUserPickerKey + 'User'] = result.users[0] || {}
      }
    },
    userSelectorShowHandle(key) {
      this.userSelectorShow = true
      this.currentUserPickerKey = key
    },
    closePicker() {
      this.userSelectorShow = false
      this.$nextTick(() => {
        this.currentUserPickerKey = ''
      })
    },
    datePickerClose() {
      this.showDatePicker = false
      this.dateKey = ''
    },
    datePickerShow(key) {
      this.dateKey = key
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form[this.dateKey] = parseTime(val, '{y}-{m}-{d}')
    },
    getLastTask() {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '摩托车里程表损坏拍照',
        task: '查询当前里程表损坏拍照',
        payload: {}
      }
      this.$loadingState(true, '数据提交中')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          console.log(data)
        })
        .catch(err => this.$loadingState(false))
    },
    checkPeriod() {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '摩托车里程表损坏拍照',
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
    doSubmit(type) {
      if (type === undefined) {
        return false
      }
      let obj = {}
      let {
        photoName = '',
        jobName = '',
        photoTime = parseTime(new Date(), '{y}-{m}-{d} {h}={i}={s}'),
        deptId = '',
        deptName = '',
        empName = '',
        empNo = '',
        jobCode = '',
        kilometre = null,
        photoPlace = '',
        photoUrl = '',
        fromTime = '',
        fromPlace = '',
        toTime = '',
        toPlace = '',
        fromVerifierName = '',
        fromVerifierNo = '',
        toVerifierName = '',
        toVerifierNo = '',
        rangeType = null // 时段 1：月初，2：月末，3：新里程表开始，4：新里程表结束
      } = Object.assign({}, this.form, {
        fromVerifierName: this.fromUser.name,
        fromVerifierNo: this.fromUser.id,
        toVerifierName: this.toUser.name,
        toVerifierNo: this.toUser.id
      })
      if (this.form.rangeType === 3) {
        obj = {
          rangeType,
          jobName,
          deptId,
          deptName,
          empName,
          empNo,
          jobCode,
          fromTime,
          fromPlace,
          toTime,
          toPlace,
          fromVerifierName,
          fromVerifierNo,
          toVerifierName,
          toVerifierNo
        }
      } else {
        obj = {
          rangeType,
          jobName,
          deptId,
          deptName,
          empName,
          empNo,
          jobCode,
          kilometre,
          photoPlace,
          photoName,
          photoUrl,
          photoTime
        }
        Object.assign(obj, { photo: this.photo })
      }
      let payload = Object.assign({}, obj, { saveType: type })
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
          module: '摩托车里程表损坏拍照',
          task: '工作里程拍照',
          payload
        }
        alert(JSON.stringify(params))
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
    DatePicker,
    UserPicker,
    MapView
  },
  created() {
    this.getUserInfo(this.getLastTask)
  },
  mounted() {
    this.$title(this.$route.name)
  }
}
</script>

<style lang="less">
.odometer-damaged-box {
  .van-field .van-cell__title {
    max-width: 110px;
    input[type='number'] {
      font-size: 0.32rem;
    }
  }
  .sub-title {
    background: #f2f2f2;
    margin: 0 -10px;
    padding: 8px 24px;
    * {
      font-size: 14px;
    }
  }
}
</style>
